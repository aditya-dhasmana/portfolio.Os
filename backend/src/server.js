/**
 * PURPOSE:
 * Provide Macfolio with safe GitHub proxying and optional Gemini response enhancement.
 * RESPONSIBILITY:
 * Own server-side API credentials, request validation, public-repo filtering, Gemini safety, caching, CORS, and API errors.
 * USED BY:
 * The Macfolio frontend GitHub API adapter.
 * DEPENDS ON:
 * Express, CORS, dotenv, Node's fetch API, and GitHub's REST API.
 * SHOULD NOT HANDLE:
 * UI state, portfolio rendering, user accounts, database storage, or arbitrary GitHub requests.
 * SCALING NOTES:
 * Split routes and services only if this proxy gains more integrations or substantially more behavior.
 */

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "node:url";

const envPath = fileURLToPath(new URL("../.env", import.meta.url));
dotenv.config({ path: envPath, quiet: true });

const app = express();
const port = Number.parseInt(process.env.PORT || "4000", 10);
const githubUsername = process.env.GITHUB_USERNAME || "aditya-dhasmana";
const githubToken = process.env.GITHUB_TOKEN?.trim() || "";
const geminiApiKey = process.env.GEMINI_API_KEY?.trim() || "";
const geminiModel = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash";
const cacheTtlSeconds = Number.parseInt(
  process.env.CACHE_TTL_SECONDS || "900",
  10,
);
const cacheTtlMs = (Number.isFinite(cacheTtlSeconds) ? cacheTtlSeconds : 900) * 1000;
const allowedRepos = new Set(
  (process.env.ALLOWED_REPOS || "")
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean),
);
const defaultFrontendOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://192.168.0.100:5173",
  "http://192.168.0.100:5174",
  "http://192.168.0.100:5175",
];
const configuredFrontendOrigins = (process.env.FRONTEND_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const isProduction = process.env.NODE_ENV === "production";
const localViteOrigin =
  /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}):(517[3-9]|51[89]\d)$/;
const frontendOrigins = new Set(
  isProduction
    ? configuredFrontendOrigins
    : [...defaultFrontendOrigins, ...configuredFrontendOrigins],
);

const GITHUB_API_URL = "https://api.github.com";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
const MAX_FILE_SIZE_BYTES = 250_000;
const MAX_CHAT_MESSAGE_LENGTH = 2_000;
const MAX_GEMINI_CONTEXT_LENGTH = 14_000;
const GEMINI_TIMEOUT_MS = Number.parseInt(
  process.env.GEMINI_TIMEOUT_MS || "20000",
  10,
);
const geminiTimeoutMs = Number.isFinite(GEMINI_TIMEOUT_MS)
  ? GEMINI_TIMEOUT_MS
  : 20_000;
const GEMINI_RATE_WINDOW_MS = Number.parseInt(
  process.env.GEMINI_RATE_WINDOW_MS || "60000",
  10,
);
const geminiRateWindowMs = Number.isFinite(GEMINI_RATE_WINDOW_MS)
  ? GEMINI_RATE_WINDOW_MS
  : 60_000;
const GEMINI_RATE_LIMIT = Number.parseInt(
  process.env.GEMINI_RATE_LIMIT || "30",
  10,
);
const geminiRateLimit = Number.isFinite(GEMINI_RATE_LIMIT)
  ? GEMINI_RATE_LIMIT
  : 30;
const GEMINI_SYSTEM_INSTRUCTION =
  "You are helping rewrite or enhance Aditya's portfolio response. You are not the real Aditya live. Speak in Aditya's friendly first-person portfolio voice. Only use the provided portfolio data. If information is missing, say it is not added yet. Do not invent companies, experience, links, achievements, or resume details. Keep answers concise and useful. Preserve action suggestions when provided.";

let reposCache = {
  data: null,
  expiresAt: 0,
};
let reposRequest = null;
const contentsCache = new Map();
const contentsRequests = new Map();
const geminiClientWindows = new Map();

class GitHubRequestError extends Error {
  constructor(status, code, message, rateLimit = null) {
    super(message);
    this.status = status;
    this.code = code;
    this.rateLimit = rateLimit;
  }
}

app.disable("x-powered-by");
const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const isAllowed =
      frontendOrigins.has(origin) ||
      (!isProduction && localViteOrigin.test(origin));

    if (isAllowed) {
      callback(null, origin);
      return;
    }

    callback(null, false);
  },
  methods: ["GET", "POST", "OPTIONS"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "32kb" }));

const createGitHubHeaders = () => {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "macfolio-github-proxy",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  return headers;
};

const requestGitHub = async (path) => {
  let response;

  try {
    response = await fetch(`${GITHUB_API_URL}${path}`, {
      headers: createGitHubHeaders(),
    });
  } catch {
    throw new GitHubRequestError(
      502,
      "GITHUB_UNREACHABLE",
      "GitHub is temporarily unreachable.",
    );
  }

  if (!response.ok) {
    const remaining = response.headers.get("x-ratelimit-remaining");
    const resetSeconds = Number.parseInt(
      response.headers.get("x-ratelimit-reset") || "",
      10,
    );
    const retryAfter = response.headers.get("retry-after");
    const isRateLimited =
      response.status === 429 ||
      (response.status === 403 && remaining === "0");
    const rateLimit = {
      remaining: remaining || null,
      resetAt: Number.isFinite(resetSeconds)
        ? new Date(resetSeconds * 1000).toISOString()
        : null,
      retryAfterSeconds: retryAfter || null,
    };
    const errors = {
      401: {
        code: "GITHUB_TOKEN_REJECTED",
        message: "GitHub rejected the backend token. Replace GITHUB_TOKEN and restart the backend.",
      },
      404: {
        code: "GITHUB_NOT_FOUND",
        message: "The requested public GitHub resource was not found.",
      },
    };
    const fallbackError = {
      code: "GITHUB_REQUEST_FAILED",
      message: "GitHub could not complete the request.",
    };
    const githubError = isRateLimited
      ? {
          code: "GITHUB_RATE_LIMITED",
          message: githubToken
            ? "GitHub rate limit reached. Please try again after the reset time."
            : "GitHub unauthenticated rate limit reached. Configure GITHUB_TOKEN in backend/.env and restart the backend.",
        }
      : errors[response.status] || fallbackError;

    throw new GitHubRequestError(
      response.status,
      githubError.code,
      githubError.message,
      rateLimit,
    );
  }

  return response.json();
};

const isAllowedRepo = (repo) => {
  return (
    repo?.private === false &&
    (allowedRepos.size === 0 || allowedRepos.has(repo.name.toLowerCase()))
  );
};

const toSafeRepo = (repo) => ({
  name: repo.name,
  full_name: repo.full_name,
  description: repo.description,
  html_url: repo.html_url,
  homepage: repo.homepage,
  language: repo.language,
  topics: Array.isArray(repo.topics) ? repo.topics : [],
  stargazers_count: repo.stargazers_count,
  forks_count: repo.forks_count,
  updated_at: repo.updated_at,
  created_at: repo.created_at,
  pushed_at: repo.pushed_at,
  visibility: repo.visibility,
  fork: repo.fork,
  archived: repo.archived,
});

const fetchAndCachePublicRepos = async () => {
  const repos = [];
  let page = 1;

  while (true) {
    const pageData = await requestGitHub(
      `/users/${encodeURIComponent(githubUsername)}/repos?per_page=100&page=${page}&sort=updated`,
    );

    if (!Array.isArray(pageData)) {
      throw new GitHubRequestError(
        502,
        "GITHUB_INVALID_RESPONSE",
        "GitHub returned an unexpected response.",
      );
    }

    repos.push(...pageData.filter(isAllowedRepo));

    if (pageData.length < 100) break;
    page += 1;
  }

  reposCache = {
    data: repos,
    expiresAt: Date.now() + cacheTtlMs,
  };

  return repos;
};

const loadPublicRepos = () => {
  if (reposCache.data && reposCache.expiresAt > Date.now()) {
    return Promise.resolve(reposCache.data);
  }

  if (!reposRequest) {
    reposRequest = fetchAndCachePublicRepos().finally(() => {
      reposRequest = null;
    });
  }

  return reposRequest;
};

const isSafePath = (path = "") => {
  if (!path) return true;

  return path.split("/").every((part) => {
    const name = part.toLowerCase();

    return (
      name &&
      !name.startsWith(".") &&
      !name.includes("secret") &&
      !name.includes("credential") &&
      !name.startsWith(".env") &&
      !name.endsWith(".pem") &&
      !name.endsWith(".key")
    );
  });
};

const findPublicRepo = async (repoName) => {
  const repos = await loadPublicRepos();
  return repos.find((repo) => repo.name.toLowerCase() === repoName.toLowerCase());
};

const toSafeContentItem = (item) => ({
  name: item.name,
  path: item.path,
  sha: item.sha,
  size: item.size,
  type: item.type,
});

const loadRepoContents = (repoName, path) => {
  const cacheKey = `${repoName.toLowerCase()}:${path}`;
  const cached = contentsCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return Promise.resolve(cached.data);
  }

  if (!contentsRequests.has(cacheKey)) {
    const suffix = path
      ? `/${path.split("/").map(encodeURIComponent).join("/")}`
      : "";
    const request = requestGitHub(
      `/repos/${encodeURIComponent(githubUsername)}/${encodeURIComponent(repoName)}/contents${suffix}`,
    )
      .then((data) => {
        contentsCache.set(cacheKey, {
          data,
          expiresAt: Date.now() + cacheTtlMs,
        });
        return data;
      })
      .finally(() => {
        contentsRequests.delete(cacheKey);
      });

    contentsRequests.set(cacheKey, request);
  }

  return contentsRequests.get(cacheKey);
};

const sendError = (res, error) => {
  const status = error instanceof GitHubRequestError ? error.status : 500;
  const message =
    error instanceof GitHubRequestError
      ? error.message
      : "The GitHub request could not be completed.";

  const payload = {
    error: message,
    code:
      error instanceof GitHubRequestError
        ? error.code
        : "INTERNAL_PROXY_ERROR",
    githubAuthentication: githubToken ? "configured" : "missing",
  };

  if (error instanceof GitHubRequestError && error.rateLimit) {
    payload.rateLimit = error.rateLimit;
  }

  res.status(status).json(payload);
};

const boundedJson = (value, maxLength = MAX_GEMINI_CONTEXT_LENGTH) => {
  try {
    return JSON.stringify(value ?? {}).slice(0, maxLength);
  } catch {
    return "{}";
  }
};

const validateGeminiInput = (body) => {
  if (!body || typeof body !== "object") return null;

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > MAX_CHAT_MESSAGE_LENGTH) return null;

  return {
    message,
    localDraft: body.localDraft && typeof body.localDraft === "object" ? body.localDraft : {},
    memory: body.memory && typeof body.memory === "object" ? body.memory : {},
    portfolio: body.portfolio && typeof body.portfolio === "object" ? body.portfolio : {},
  };
};

const enforceGeminiRateLimit = (req, res, next) => {
  const now = Date.now();
  const clientId = req.ip || req.socket?.remoteAddress || "unknown";
  const current = geminiClientWindows.get(clientId);

  if (!current || current.resetAt <= now) {
    geminiClientWindows.set(clientId, {
      count: 1,
      resetAt: now + geminiRateWindowMs,
    });
    next();
    return;
  }

  if (current.count >= geminiRateLimit) {
    const resetSeconds = Math.ceil((current.resetAt - now) / 1000);

    if (!isProduction) {
      console.warn("Gemini client rate limit hit", {
        clientId,
        count: current.count,
        resetSeconds,
      });
    }

    res.set("Retry-After", String(resetSeconds));
    res.status(429).json({
      error: "AI enhancement is temporarily busy.",
      code: "GEMINI_CLIENT_RATE_LIMITED",
    });
    return;
  }

  current.count += 1;
  next();
};

const extractGeminiText = (payload) => {
  const directTextCandidates = [
    payload?.output_text,
    payload?.output?.text,
    payload?.response?.text,
    payload?.text,
  ];

  for (const candidate of directTextCandidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  if (Array.isArray(payload?.steps)) {
    for (const step of payload.steps) {
      if (step?.type !== "model_output") continue;

      const contentItems = Array.isArray(step.content)
        ? step.content
        : [step.content];
      const textParts = [];

      for (const item of contentItems) {
        if (typeof item === "string") {
          textParts.push(item);
          continue;
        }

        if (!item || typeof item !== "object") continue;

        for (const candidate of [item.text, item.output_text, item.content]) {
          if (typeof candidate === "string") textParts.push(candidate);
        }

        if (Array.isArray(item.parts)) {
          textParts.push(
            ...item.parts
              .filter((part) => typeof part?.text === "string")
              .map((part) => part.text),
          );
        }
      }

      const modelOutputText = textParts.join("").trim();
      if (modelOutputText) return modelOutputText;
    }
  }

  const legacyText = payload?.candidates?.[0]?.content?.parts
    ?.filter((part) => typeof part?.text === "string")
    .map((part) => part.text)
    .join("")
    .trim();
  if (legacyText) return legacyText;

  const collectedStrings = [];
  const collectableKeys = new Set(["text", "output_text", "content"]);
  const excludedKeys = new Set([
    "signature",
    "id",
    "model",
    "status",
    "created",
    "updated",
  ]);
  const visited = new WeakSet();

  const walk = (value) => {
    if (!value || typeof value !== "object" || visited.has(value)) return;
    visited.add(value);

    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }

    for (const [key, child] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase();
      if (
        excludedKeys.has(normalizedKey) ||
        normalizedKey.includes("signature")
      ) {
        continue;
      }

      if (
        collectableKeys.has(normalizedKey) &&
        typeof child === "string" &&
        child.length <= 10_000
      ) {
        collectedStrings.push(child);
      }

      walk(child);
    }
  };

  walk(payload);

  return (
    collectedStrings.find((value) => {
      const candidate = value.trim();
      return candidate.startsWith("{") || candidate.includes('"message"');
    }) || ""
  );
};

const createGeminiDebugPreview = (payload) => {
  const privateKeys = new Set([
    "signature",
    "input",
    "prompt",
    "system_instruction",
    "portfolio",
    "memory",
    "context",
  ]);

  const sanitize = (value) => {
    if (Array.isArray(value)) return value.map(sanitize);
    if (!value || typeof value !== "object") return value;

    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([key]) =>
            !privateKeys.has(key.toLowerCase()) &&
            !key.toLowerCase().includes("signature"),
        )
        .map(([key, child]) => [key, sanitize(child)]),
    );
  };

  try {
    return JSON.stringify(sanitize(payload)).slice(0, 1_000);
  } catch {
    return "[unavailable]";
  }
};

const logGeminiParserFailure = (payload) => {
  if (isProduction) return;

  const modelOutputContentItemKeys = Array.isArray(payload?.steps)
    ? payload.steps
        .filter((step) => step?.type === "model_output")
        .flatMap((step) =>
          (Array.isArray(step.content) ? step.content : [step.content]).map(
            (item) =>
              item && typeof item === "object"
                ? Object.keys(item).filter(
                    (key) => !key.toLowerCase().includes("signature"),
                  )
                : [],
          ),
        )
    : [];

  console.error("Gemini parser failed", {
    topLevelKeys:
      payload && typeof payload === "object"
        ? Object.keys(payload).filter(
            (key) => !key.toLowerCase().includes("signature"),
          )
        : [],
    status: payload?.status,
    stepTypes: Array.isArray(payload?.steps)
      ? payload.steps.map((step) => step?.type).filter(Boolean)
      : [],
    modelOutputContentItemKeys,
    preview: createGeminiDebugPreview(payload),
  });
};

const parseGeminiEnhancement = (payload) => {
  let text = extractGeminiText(payload).trim();

  if (!text) {
    logGeminiParserFailure(payload);
    return null;
  }

  text = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  let value;
  try {
    value = JSON.parse(text);
  } catch {
    logGeminiParserFailure(payload);
    return null;
  }

  const message = typeof value?.message === "string" ? value.message.trim() : "";
  if (!message || message.length > MAX_CHAT_MESSAGE_LENGTH) {
    logGeminiParserFailure(payload);
    return null;
  }

  const suggestions = Array.isArray(value.suggestions)
    ? value.suggestions
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 4)
    : [];
  const confidence =
    typeof value.confidence === "number"
      ? Math.max(0, Math.min(1, value.confidence))
      : undefined;

  return { message, suggestions, confidence, usedGemini: true };
};

const requestGeminiEnhancement = async (input) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), geminiTimeoutMs);
  const finalPrompt = [
    `User message:\n${input.message}`,
    `Local draft (facts, intent, and action labels are authoritative):\n${boundedJson(input.localDraft, 5_000)}`,
    `Recent public session summary:\n${boundedJson(input.memory, 2_000)}`,
    `Safe public portfolio context:\n${boundedJson(input.portfolio)}`,
    "Rewrite only the response message when useful. Suggestions must be short portfolio follow-up questions. Do not add actions, URLs, or facts.",
  ].join("\n\n");

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiApiKey,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: geminiModel,
        input: finalPrompt,
        system_instruction: GEMINI_SYSTEM_INSTRUCTION,
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: {
            type: "object",
            properties: {
              message: { type: "string" },
              suggestions: {
                type: "array",
                maxItems: 4,
                items: { type: "string" },
              },
              confidence: {
                type: "number",
                minimum: 0,
                maximum: 1,
              },
              usedGemini: { type: "boolean" },
            },
            required: ["message", "suggestions", "usedGemini"],
            additionalProperties: false,
          },
        },
      }),
    });

    if (!response.ok) {
      const responseBody = (await response.text()).slice(0, 500);
      if (!isProduction) {
        console.error("Gemini request failed.", {
          status: response.status,
          body: responseBody,
        });
      }

      const error = new Error("Gemini request failed.");
      error.status = response.status;
      throw error;
    }

    const enhancement = parseGeminiEnhancement(await response.json());
    if (!enhancement) {
      const error = new Error("Gemini returned an invalid response.");
      error.code = "GEMINI_INVALID_RESPONSE";
      throw error;
    }

    return enhancement;
  } catch (error) {
    if (!isProduction && error?.name === "AbortError") {
      console.error(`Gemini request timed out after ${geminiTimeoutMs} ms`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    githubAuthentication: githubToken ? "configured" : "missing",
    geminiEnhancement: geminiApiKey ? "configured" : "missing",
  });
});

app.post("/api/gemini", enforceGeminiRateLimit, async (req, res) => {
  if (!geminiApiKey) {
    res.status(503).json({
      error: "AI enhancement is not configured.",
      code: "GEMINI_NOT_CONFIGURED",
    });
    return;
  }

  const input = validateGeminiInput(req.body);
  if (!input) {
    res.status(400).json({
      error: "A valid portfolio question is required.",
      code: "GEMINI_INVALID_INPUT",
    });
    return;
  }

  try {
    res.json(await requestGeminiEnhancement(input));
  } catch (error) {
    const status = error?.status;
    const isRateLimited = status === 429;
    const isBlocked = status === 403;
    const isTimeout = error?.name === "AbortError";

    res.status(isRateLimited ? 429 : 503).json({
      error: "AI enhancement is temporarily unavailable.",
      code: isRateLimited
        ? "GEMINI_RATE_LIMITED"
        : isBlocked
          ? "GEMINI_BLOCKED"
          : isTimeout
            ? "GEMINI_TIMEOUT"
            : error?.code === "GEMINI_INVALID_RESPONSE"
              ? "GEMINI_INVALID_RESPONSE"
              : "GEMINI_UNAVAILABLE",
    });
  }
});

app.get("/api/github/repos", async (_req, res) => {
  try {
    const repos = await loadPublicRepos();
    res.json(repos.map(toSafeRepo));
  } catch (error) {
    sendError(res, error);
  }
});

app.get("/api/github/repos/:repoName/contents", async (req, res) => {
  const repoName = req.params.repoName;
  const path = typeof req.query.path === "string" ? req.query.path : "";

  if (!isSafePath(repoName) || !isSafePath(path)) {
    res.status(400).json({ error: "That repository path is not available." });
    return;
  }

  try {
    const repo = await findPublicRepo(repoName);

    if (!repo) {
      res.status(404).json({ error: "Public repository not found." });
      return;
    }

    const data = await loadRepoContents(repo.name, path);

    if (Array.isArray(data)) {
      res.json(
        data
          .filter((item) => ["dir", "file"].includes(item?.type))
          .filter((item) => isSafePath(item.path))
          .map(toSafeContentItem),
      );
      return;
    }

    if (
      data?.type !== "file" ||
      !isSafePath(data.path) ||
      data.size > MAX_FILE_SIZE_BYTES ||
      data.encoding !== "base64" ||
      typeof data.content !== "string"
    ) {
      res.status(400).json({ error: "That file cannot be previewed safely." });
      return;
    }

    res.json({
      ...toSafeContentItem(data),
      content: Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8"),
    });
  } catch (error) {
    sendError(res, error);
  }
});

app.use((error, _req, res, next) => {
  if (!error) {
    next();
    return;
  }

  res.status(400).json({
    error: "The request could not be processed.",
    code: "INVALID_REQUEST_BODY",
  });
});

app.listen(port, () => {
  console.log(`Macfolio GitHub proxy listening on http://localhost:${port}`);
});

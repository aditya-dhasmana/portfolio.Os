/**
 * PURPOSE:
 * Provide Macfolio with a small, safe GitHub proxy and repository cache.
 * RESPONSIBILITY:
 * Own GitHub authentication, public-repo filtering, safe response mapping, caching, CORS, and API errors.
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
  /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.0\.100):(517[3-9]|51[89]\d)$/;
const frontendOrigins = new Set(
  isProduction
    ? configuredFrontendOrigins
    : [...defaultFrontendOrigins, ...configuredFrontendOrigins],
);

const GITHUB_API_URL = "https://api.github.com";
const MAX_FILE_SIZE_BYTES = 250_000;

let reposCache = {
  data: null,
  expiresAt: 0,
};
let reposRequest = null;
const contentsCache = new Map();
const contentsRequests = new Map();

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
  methods: ["GET", "OPTIONS"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

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

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    githubAuthentication: githubToken ? "configured" : "missing",
  });
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

app.listen(port, () => {
  console.log(`Macfolio GitHub proxy listening on http://localhost:${port}`);
});

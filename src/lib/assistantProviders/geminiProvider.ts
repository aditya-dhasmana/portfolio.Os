/**
 * PURPOSE:
 * Request optional Gemini wording enhancement through Macfolio's backend.
 * RESPONSIBILITY:
 * Send bounded public context, enforce a frontend timeout, and validate the safe response shape.
 * USED BY:
 * The hybrid assistant provider.
 * DEPENDS ON:
 * VITE_API_BASE_URL, browser fetch, portfolio data, and shared assistant types.
 * SHOULD NOT HANDLE:
 * API keys, local intent rules, cards, actions, window state, or fallback policy.
 * SCALING NOTES:
 * Replace this transport without changing hybrid policy or Safari rendering.
 */

import { portfolioData } from "../../data/portfolioData";
import type {
  AssistantMemory,
  PortfolioAssistantResponse,
} from "../assistantTypes";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000").replace(/\/$/, "");
// Wait slightly longer than the backend's default 20-second provider timeout.
const GEMINI_TIMEOUT_MS = 25_000;
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_SUGGESTIONS = 4;

export class GeminiProviderError extends Error {
  code: string;

  constructor(code: string) {
    super("Gemini enhancement is unavailable.");
    this.name = "GeminiProviderError";
    this.code = code;
  }
}

const createSafePortfolioContext = () => ({
  profile: {
    name: portfolioData.profile.name,
    title: portfolioData.profile.title,
    shortIntro: portfolioData.profile.shortIntro,
    about: portfolioData.profile.about,
    interests: portfolioData.profile.interests,
    currentFocus: portfolioData.profile.currentFocus,
  },
  skills: {
    languages: portfolioData.skills.languages,
    frontend: portfolioData.skills.frontend,
    backend: portfolioData.skills.backend,
    tools: portfolioData.skills.tools,
    currentlyLearning: portfolioData.skills.currentlyLearning,
  },
  projects: portfolioData.projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    stack: project.stack,
    tags: project.tags,
    featured: project.featured,
    whyItMatters: project.whyItMatters,
    hasGithub: Boolean(project.githubUrl),
    hasLiveDemo: Boolean(project.liveUrl),
  })),
  resume: {
    summary: portfolioData.resume.summary,
    isDownloadAvailable: portfolioData.resume.isDownloadAvailable,
  },
  contact: {
    hasEmail: Boolean(portfolioData.contact.email),
    hasGithub: Boolean(portfolioData.contact.github),
    hasLinkedIn: Boolean(portfolioData.contact.linkedIn),
  },
  blogPosts: portfolioData.blogPosts.map((post) => ({
    title: post.title,
    summary: post.summary,
    tags: post.tags,
  })),
});

const createSafeMemorySummary = (memory: AssistantMemory) => ({
  lastIntent: memory.lastIntent,
  lastTopic: memory.lastTopic,
  lastShownProjectIds: memory.lastShownProjectIds.slice(0, 5),
  lastRecommendedProjectId: memory.lastRecommendedProjectId,
  conversationCount: memory.conversationCount,
  currentMode: memory.currentMode,
});

const validateEnhancement = (value: unknown) => {
  if (!value || typeof value !== "object") {
    throw new GeminiProviderError("INVALID_RESPONSE");
  }

  const candidate = value as Record<string, unknown>;
  const message = typeof candidate.message === "string" ? candidate.message.trim() : "";

  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    throw new GeminiProviderError("INVALID_RESPONSE");
  }

  const suggestions = Array.isArray(candidate.suggestions)
    ? candidate.suggestions
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, MAX_SUGGESTIONS)
    : [];

  const confidence =
    typeof candidate.confidence === "number"
      ? Math.max(0, Math.min(1, candidate.confidence))
      : undefined;

  return { message, suggestions, confidence, usedGemini: true as const };
};

export const requestGeminiEnhancement = async ({
  input,
  memory,
  localResponse,
}: {
  input: string;
  memory: AssistantMemory;
  localResponse: PortfolioAssistantResponse;
}) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/api/gemini`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        message: input.slice(0, MAX_MESSAGE_LENGTH),
        localDraft: {
          intent: localResponse.intent,
          confidence: localResponse.confidence,
          message: localResponse.message,
          suggestions: localResponse.suggestions.slice(0, MAX_SUGGESTIONS),
          actionLabels: [
            ...(localResponse.cards || []).flatMap((card) => card.actions.map((action) => action.label)),
            ...(localResponse.quickActions || []).map((action) => action.label),
          ].slice(0, 12),
        },
        memory: createSafeMemorySummary(memory),
        portfolio: createSafePortfolioContext(),
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      const code = typeof payload?.code === "string" ? payload.code : `HTTP_${response.status}`;
      throw new GeminiProviderError(code);
    }

    return validateEnhancement(await response.json());
  } catch (error) {
    if (error instanceof GeminiProviderError) throw error;
    throw new GeminiProviderError(error instanceof DOMException && error.name === "AbortError" ? "TIMEOUT" : "NETWORK_ERROR");
  } finally {
    window.clearTimeout(timeout);
  }
};

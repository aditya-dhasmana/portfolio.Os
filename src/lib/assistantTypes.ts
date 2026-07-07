/**
 * PURPOSE:
 * Define provider-independent contracts for Macfolio Chat V3.
 * RESPONSIBILITY:
 * Describe modes, intents, memory, responses, provider metadata, and async provider behavior.
 * USED BY:
 * Local, Gemini, hybrid providers and the Safari chat UI.
 * DEPENDS ON:
 * Portfolio card and action types only.
 * SHOULD NOT HANDLE:
 * Intent rules, HTTP calls, rendering, timers, or window actions.
 * SCALING NOTES:
 * New providers must satisfy these contracts so local cards and actions remain authoritative.
 */

import type {
  PortfolioAction,
  PortfolioAppId,
  PortfolioCard,
} from "../data/portfolioData";

export type AssistantMode = "auto" | "local" | "ai";
export type AssistantSource = "local" | "gemini" | "local-fallback";

export type PortfolioIntent =
  | "greeting"
  | "about"
  | "projects"
  | "filteredProjects"
  | "resume"
  | "downloadResume"
  | "skills"
  | "learning"
  | "hire"
  | "blog"
  | "contact"
  | "github"
  | "recommendation"
  | "projectFollowUp"
  | "portfolioBuild"
  | "help"
  | "unknown";

export interface AssistantMemory {
  lastIntent: PortfolioIntent | null;
  lastTopic: string | null;
  lastShownProjectIds: string[];
  lastRecommendedProjectId: string | null;
  lastOpenedApp: PortfolioAppId | null;
  lastExternalLink: string | null;
  lastCardsShown: string[];
  lastSuggestions: string[];
  conversationCount: number;
  currentMode: AssistantMode;
}

export interface PortfolioAssistantResponse {
  intent: PortfolioIntent;
  confidence: number;
  message: string;
  cards?: PortfolioCard[];
  quickActions?: Array<{ label: string; action: PortfolioAction }>;
  autoAction?: PortfolioAction;
  suggestions: string[];
  thinkingLabel?: string;
  source?: AssistantSource;
  notice?: string;
  usedGemini?: boolean;
}

export interface PortfolioAssistantResult {
  response: PortfolioAssistantResponse;
  memory: AssistantMemory;
}

export interface AssistantProviderRequest {
  input: string;
  memory: AssistantMemory;
  mode: AssistantMode;
}

export interface AssistantProvider {
  respond(request: AssistantProviderRequest): Promise<PortfolioAssistantResult>;
}

export const isAssistantMode = (value: string): value is AssistantMode =>
  value === "auto" || value === "local" || value === "ai";

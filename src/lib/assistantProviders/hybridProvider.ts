/**
 * PURPOSE:
 * Coordinate Local, Auto, and AI Enhanced modes for Macfolio Chat V3.
 * RESPONSIBILITY:
 * Always run the local brain, decide whether Gemini adds value, merge safe wording, and guarantee fallback.
 * USED BY:
 * The Safari chat UI.
 * DEPENDS ON:
 * Local provider, Gemini transport, and shared assistant types.
 * SHOULD NOT HANDLE:
 * Rendering, API keys, window execution, cards, links, or portfolio fact creation.
 * SCALING NOTES:
 * Add provider-selection policy here while leaving local actions authoritative.
 */

import type {
  AssistantMode,
  AssistantProvider,
  PortfolioAssistantResponse,
} from "../assistantTypes";
import {
  GeminiProviderError,
  requestGeminiEnhancement,
} from "./geminiProvider";
import { localProvider } from "./localProvider";

export const AI_RATE_LIMIT_NOTICE =
  "AI enhanced mode is cooling down. Using local brain for now.";

const autoEnhancedIntents = new Set([
  "about",
  "hire",
  "learning",
  "recommendation",
  "portfolioBuild",
  "skills",
  "unknown",
]);

const flexibleQuestionPattern = /why|explain|compare|summari[sz]e|recruiter|simple words|good fit/i;
const simpleLocalOnlyPattern = /^(hi|hello|resume|projects|contact)[!.?]*$/i;

const shouldEnhance = (
  mode: AssistantMode,
  input: string,
  localResponse: PortfolioAssistantResponse,
) => {
  if (mode === "local") return false;
  if (mode === "ai") return !input.trim().startsWith("/");
  if (simpleLocalOnlyPattern.test(input.trim())) return false;

  return (
    autoEnhancedIntents.has(localResponse.intent) ||
    flexibleQuestionPattern.test(input)
  );
};

export const hybridProvider: AssistantProvider = {
  async respond(request) {
    const localResult = await localProvider.respond(request);

    if (!shouldEnhance(request.mode, request.input, localResult.response)) {
      return localResult;
    }

    try {
      const enhancement = await requestGeminiEnhancement({
        input: request.input,
        memory: localResult.memory,
        localResponse: localResult.response,
      });

      return {
        memory: localResult.memory,
        response: {
          ...localResult.response,
          message: enhancement.message,
          suggestions:
            enhancement.suggestions.length > 0
              ? enhancement.suggestions
              : localResult.response.suggestions,
          confidence: enhancement.confidence ?? localResult.response.confidence,
          source: "gemini",
          usedGemini: true,
          notice: undefined,
        },
      };
    } catch (error) {
      const isRateLimited =
        error instanceof GeminiProviderError &&
        [
          "GEMINI_CLIENT_RATE_LIMITED",
          "GEMINI_RATE_LIMITED",
          "HTTP_429",
        ].includes(error.code);

      return {
        memory: localResult.memory,
        response: {
          ...localResult.response,
          source: "local-fallback",
          usedGemini: false,
          notice: isRateLimited
            ? AI_RATE_LIMIT_NOTICE
            : request.mode === "ai"
              ? "AI enhancement is unavailable right now, so I'm using my local portfolio brain."
              : undefined,
        },
      };
    }
  },
};

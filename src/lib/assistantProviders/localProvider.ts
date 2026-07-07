/**
 * PURPOSE:
 * Adapt the deterministic portfolio engine to the async V3 provider contract.
 * RESPONSIBILITY:
 * Run the local brain without network access and mark the response as local.
 * USED BY:
 * The hybrid provider and Local mode.
 * DEPENDS ON:
 * portfolioAssistant.ts and shared assistant types.
 * SHOULD NOT HANDLE:
 * Gemini calls, mode policy, UI state, or window actions.
 * SCALING NOTES:
 * Keep this provider as the guaranteed offline path even when more providers are added.
 */

import { runLocalAssistant } from "../portfolioAssistant";
import type { AssistantProvider } from "../assistantTypes";

export const localProvider: AssistantProvider = {
  async respond({ input, memory, mode }) {
    const result = runLocalAssistant(input, { ...memory, currentMode: mode });

    return {
      ...result,
      response: {
        ...result.response,
        source: "local",
        usedGemini: false,
      },
      memory: {
        ...result.memory,
        currentMode: mode,
      },
    };
  },
};

/**
 * PURPOSE:
 * Preserve the existing constants import path for desktop window config.
 * RESPONSIBILITY:
 * Re-export desktop shell window configuration.
 * USED BY:
 * Existing imports from #constants and src/constants/windowConfig.js.
 * DEPENDS ON:
 * features/desktop-shell/config/windowConfig.js.
 * SHOULD NOT HANDLE:
 * Defining window configuration directly.
 * SCALING NOTES:
 * Remove this compatibility bridge after imports point to the desktop-shell feature.
 */

export {
  INITIAL_Z_INDEX,
  DEFAULT_WINDOW_SIZES,
  WINDOW_CONFIG,
} from "../features/desktop-shell/config/windowConfig";

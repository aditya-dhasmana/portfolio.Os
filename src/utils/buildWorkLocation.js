/**
 * PURPOSE:
 * Preserve the existing buildWorkLocation import path.
 * RESPONSIBILITY:
 * Re-export the portfolio feature data builder.
 * USED BY:
 * Existing files that still import from src/utils/buildWorkLocation.js.
 * DEPENDS ON:
 * features/portfolio/utils/buildWorkLocation.js.
 * SHOULD NOT HANDLE:
 * Data fetching, caching, mapping, rendering, or app state.
 * SCALING NOTES:
 * Remove this bridge after all imports point to the portfolio feature boundary.
 */

export { buildWorkLocation } from "../features/portfolio/utils/buildWorkLocation";

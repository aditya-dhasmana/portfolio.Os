/**
 * PURPOSE:
 * Re-export application constants from focused ownership modules.
 * RESPONSIBILITY:
 * Preserve the existing #constants import surface while constants are split by responsibility.
 * USED BY:
 * Existing components, stores, windows, and feature modules.
 * DEPENDS ON:
 * Focused constants modules.
 * SHOULD NOT HANDLE:
 * Defining new constants directly, rendering, state, or API requests.
 * SCALING NOTES:
 * New constants should be added to the module that owns their responsibility, then exported here if still needed.
 */

export { navLinks, navIcons } from "./navigation";
export { dockApps } from "./desktopApps";
export {
  blogPosts,
  techStack,
  socials,
  photosLinks,
  gallery,
} from "./portfolioContent";
export { locations } from "./locations";
export {
  INITIAL_Z_INDEX,
  WINDOW_CONFIG,
  DEFAULT_WINDOW_SIZES,
} from "./windowConfig";

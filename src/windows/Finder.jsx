/**
 * PURPOSE:
 * Preserve the existing desktop window import path for Finder.
 * RESPONSIBILITY:
 * Re-export the Finder feature window.
 * USED BY:
 * src/windows/index.js and any existing imports from src/windows/Finder.jsx.
 * DEPENDS ON:
 * features/finder/FinderWindow.jsx.
 * SHOULD NOT HANDLE:
 * Finder rendering, location state, file-opening behavior, or window composition.
 * SCALING NOTES:
 * This compatibility file can be removed after imports point directly to the feature boundary.
 */

export { default } from "../features/finder/FinderWindow";

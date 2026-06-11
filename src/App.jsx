/**
 * PURPOSE:
 * Preserve the existing App import path.
 * RESPONSIBILITY:
 * Re-export the app composition entry.
 * USED BY:
 * Existing imports from src/App.jsx.
 * DEPENDS ON:
 * app/App.jsx.
 * SHOULD NOT HANDLE:
 * App implementation.
 * SCALING NOTES:
 * Remove this compatibility bridge after entry imports point directly to src/app/App.jsx.
 */

export { default } from "./app/App";

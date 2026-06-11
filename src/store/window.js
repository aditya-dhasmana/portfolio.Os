/**
 * PURPOSE:
 * Preserve the existing desktop window store import path.
 * RESPONSIBILITY:
 * Re-export the desktop shell window store.
 * USED BY:
 * Existing imports from #store/window and #store.
 * DEPENDS ON:
 * features/desktop-shell/store/windowStore.js.
 * SHOULD NOT HANDLE:
 * Window state implementation.
 * SCALING NOTES:
 * Remove this compatibility bridge after imports point to the desktop-shell feature.
 */

export { default } from "../features/desktop-shell/store/windowStore";

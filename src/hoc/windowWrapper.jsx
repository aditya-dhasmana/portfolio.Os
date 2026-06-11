/**
 * PURPOSE:
 * Preserve the existing windowWrapper import path.
 * RESPONSIBILITY:
 * Re-export the desktop shell window wrapper.
 * USED BY:
 * Existing desktop app windows that import from #hoc/windowWrapper.
 * DEPENDS ON:
 * features/desktop-shell/hoc/windowWrapper.jsx.
 * SHOULD NOT HANDLE:
 * Window wrapper implementation.
 * SCALING NOTES:
 * Remove this compatibility bridge after imports point to the desktop-shell feature.
 */

export { default } from "../features/desktop-shell/hoc/windowWrapper";

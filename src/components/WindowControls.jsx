/**
 * PURPOSE:
 * Preserve the existing WindowControls import path.
 * RESPONSIBILITY:
 * Re-export the desktop shell WindowControls component.
 * USED BY:
 * Desktop app windows and #components/Index.
 * DEPENDS ON:
 * features/desktop-shell/components/WindowControls.jsx.
 * SHOULD NOT HANDLE:
 * WindowControls implementation.
 * SCALING NOTES:
 * Remove this compatibility bridge after imports point to the desktop-shell feature.
 */

export { default } from "../features/desktop-shell/components/WindowControls";

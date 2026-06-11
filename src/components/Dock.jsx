/**
 * PURPOSE:
 * Preserve the existing Dock import path.
 * RESPONSIBILITY:
 * Re-export the desktop shell Dock component.
 * USED BY:
 * Existing imports from #components/Dock and #components/Index.
 * DEPENDS ON:
 * features/desktop-shell/components/Dock.jsx.
 * SHOULD NOT HANDLE:
 * Dock implementation.
 * SCALING NOTES:
 * Remove this compatibility bridge after imports point to the desktop-shell feature.
 */

export { default } from "../features/desktop-shell/components/Dock";

/**
 * PURPOSE:
 * Preserve the existing desktop Home import path.
 * RESPONSIBILITY:
 * Re-export the desktop shell Home component.
 * USED BY:
 * Existing imports from #components/Home and #components/Index.
 * DEPENDS ON:
 * features/desktop-shell/components/Home.jsx.
 * SHOULD NOT HANDLE:
 * Desktop home implementation.
 * SCALING NOTES:
 * Remove this compatibility bridge after imports point to the desktop-shell feature.
 */

export { default } from "../features/desktop-shell/components/Home";

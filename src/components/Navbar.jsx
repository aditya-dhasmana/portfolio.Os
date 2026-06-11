/**
 * PURPOSE:
 * Preserve the existing Navbar import path.
 * RESPONSIBILITY:
 * Re-export the desktop shell Navbar component.
 * USED BY:
 * Existing imports from #components/Navbar and #components/Index.
 * DEPENDS ON:
 * features/desktop-shell/components/Navbar.jsx.
 * SHOULD NOT HANDLE:
 * Navbar implementation.
 * SCALING NOTES:
 * Remove this compatibility bridge after imports point to the desktop-shell feature.
 */

export { default } from "../features/desktop-shell/components/Navbar";

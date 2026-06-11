/**
 * PURPOSE:
 * Preserve the existing mobile app import path.
 * RESPONSIBILITY:
 * Re-export the mobile shell feature entry point.
 * USED BY:
 * Existing imports from src/mobile/MobileApp.jsx.
 * DEPENDS ON:
 * features/mobile-shell/MobileApp.jsx.
 * SHOULD NOT HANDLE:
 * Mobile shell implementation.
 * SCALING NOTES:
 * Remove this compatibility bridge after imports point to the mobile-shell feature.
 */

export { default } from "../features/mobile-shell/MobileApp";

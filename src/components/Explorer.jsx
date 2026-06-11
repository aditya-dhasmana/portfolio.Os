/**
 * PURPOSE:
 * Preserve the existing Explorer import path.
 * RESPONSIBILITY:
 * Re-export the code-preview Explorer component.
 * USED BY:
 * Existing imports from #components/Explorer and #components/Index.
 * DEPENDS ON:
 * features/code-preview/components/Explorer.jsx.
 * SHOULD NOT HANDLE:
 * Explorer implementation.
 * SCALING NOTES:
 * Remove this compatibility bridge after imports point to the code-preview feature.
 */

export { default } from "../features/code-preview/components/Explorer";

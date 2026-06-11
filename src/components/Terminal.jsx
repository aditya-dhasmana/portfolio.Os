/**
 * PURPOSE:
 * Preserve the existing code-preview Terminal import path.
 * RESPONSIBILITY:
 * Re-export the code-preview Terminal component.
 * USED BY:
 * Existing imports from #components/Terminal and #components/Index.
 * DEPENDS ON:
 * features/code-preview/components/Terminal.jsx.
 * SHOULD NOT HANDLE:
 * Terminal panel implementation.
 * SCALING NOTES:
 * Remove this compatibility bridge after imports point to the code-preview feature.
 */

export { default } from "../features/code-preview/components/Terminal";

/**
 * PURPOSE:
 * Preserve the existing Editor import path.
 * RESPONSIBILITY:
 * Re-export the code-preview Editor component.
 * USED BY:
 * Existing imports from #components/Editor and #components/Index.
 * DEPENDS ON:
 * features/code-preview/components/Editor.jsx.
 * SHOULD NOT HANDLE:
 * Editor implementation.
 * SCALING NOTES:
 * Remove this compatibility bridge after imports point to the code-preview feature.
 */

export { default } from "../features/code-preview/components/Editor";

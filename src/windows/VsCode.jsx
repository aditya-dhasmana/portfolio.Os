/**
 * PURPOSE:
 * Preserve the existing VS Code window import path.
 * RESPONSIBILITY:
 * Re-export the code-preview feature window.
 * USED BY:
 * src/windows/index.js and existing imports from src/windows/VsCode.jsx.
 * DEPENDS ON:
 * features/code-preview/windows/CodePreviewWindow.jsx.
 * SHOULD NOT HANDLE:
 * Code preview rendering, repo loading, editor tabs, or window composition.
 * SCALING NOTES:
 * Remove this compatibility bridge after imports point to the code-preview feature.
 */

export { default } from "../features/code-preview/windows/CodePreviewWindow";

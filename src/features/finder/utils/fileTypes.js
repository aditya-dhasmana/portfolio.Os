/**
 * PURPOSE:
 * Define Finder file-type groups.
 * RESPONSIBILITY:
 * Keep file type checks consistent across Finder utilities.
 * USED BY:
 * Finder open-action logic and Finder UI components.
 * DEPENDS ON:
 * No app dependencies.
 * SHOULD NOT HANDLE:
 * Rendering, API requests, window state, or navigation state.
 * SCALING NOTES:
 * If more app features need these checks, move them to a shared file-system domain.
 */

export const CODE_FILE_TYPES = [
  "js",
  "jsx",
  "ts",
  "tsx",
  "css",
  "html",
  "json",
  "md",
  "txt",
];

export const LINK_FILE_TYPES = ["fig", "url"];

export const isCodeFile = (fileType) => CODE_FILE_TYPES.includes(fileType);

export const isExternalLinkFile = (fileType) => LINK_FILE_TYPES.includes(fileType);

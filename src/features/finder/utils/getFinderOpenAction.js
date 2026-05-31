/**
 * PURPOSE:
 * Decide what Finder should do when a user opens an item.
 * RESPONSIBILITY:
 * Convert a file-system item into an explicit action.
 * USED BY:
 * FinderWindow.
 * DEPENDS ON:
 * Finder file type helpers.
 * SHOULD NOT HANDLE:
 * Calling window.open, updating React state, or opening Zustand windows directly.
 * SCALING NOTES:
 * Keeping this pure makes future tests and new file types easier to add.
 */

import { isCodeFile, isExternalLinkFile } from "./fileTypes";

export const FINDER_OPEN_ACTIONS = {
  NONE: "none",
  SET_LOCATION: "set-location",
  OPEN_WINDOW: "open-window",
  OPEN_EXTERNAL_LINK: "open-external-link",
};

export const getFinderOpenAction = (item) => {
  if (!item) {
    return { type: FINDER_OPEN_ACTIONS.NONE };
  }

  if (item.fileType === "pdf") {
    return {
      type: FINDER_OPEN_ACTIONS.OPEN_WINDOW,
      windowId: "resume",
    };
  }

  if (item.kind === "folder") {
    return {
      type: FINDER_OPEN_ACTIONS.SET_LOCATION,
      location: item,
    };
  }

  if (item.fileType === "txt" && !item.download_url) {
    return {
      type: FINDER_OPEN_ACTIONS.OPEN_WINDOW,
      windowId: "txtfile",
      data: item,
    };
  }

  if (item.fileType === "img") {
    return {
      type: FINDER_OPEN_ACTIONS.OPEN_WINDOW,
      windowId: "imgfile",
      data: item,
    };
  }

  if (isExternalLinkFile(item.fileType) && item.href) {
    return {
      type: FINDER_OPEN_ACTIONS.OPEN_EXTERNAL_LINK,
      href: item.href,
    };
  }

  if (isCodeFile(item.fileType)) {
    return {
      type: FINDER_OPEN_ACTIONS.OPEN_WINDOW,
      windowId: "vsCode",
      data: { file: item },
    };
  }

  return { type: FINDER_OPEN_ACTIONS.NONE };
};

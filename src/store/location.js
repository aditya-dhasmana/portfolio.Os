/**
 * PURPOSE:
 * Own the canonical Finder folder path.
 * RESPONSIBILITY:
 * Navigate to a complete path, move to its parent, and initialize Finder at a root folder.
 * USED BY:
 * Finder navigation, desktop project folders, and application startup.
 * DEPENDS ON:
 * Zustand and Immer.
 * SHOULD NOT HANDLE:
 * File rendering, Finder sidebar state, breadcrumbs, window state, or portfolio loading.
 * SCALING NOTES:
 * Keep one path as the navigation source; derive the current folder and selected root from it.
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const isValidPath = (path) =>
  Array.isArray(path) && path.length > 0 && path.every(Boolean);

const useLocationStore = create(
  immer((set) => ({
    currentPath: [],

    navigateTo: (path) =>
      set((state) => {
        if (!isValidPath(path)) return;
        state.currentPath = path;
      }),

    goBackLocation: () =>
      set((state) => {
        if (state.currentPath.length <= 1) return;
        state.currentPath = state.currentPath.slice(0, -1);
      }),

    resetNavigation: (rootLocation) =>
      set((state) => {
        state.currentPath = rootLocation ? [rootLocation] : [];
      }),
  }))
);

export default useLocationStore;

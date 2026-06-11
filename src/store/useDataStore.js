/**
 * PURPOSE:
 * Store portfolio domain data that multiple features need.
 * RESPONSIBILITY:
 * Own the Work folder, loading status, and loading errors.
 * USED BY:
 * Portfolio data hooks, desktop Home, and future shared portfolio consumers.
 * DEPENDS ON:
 * Zustand.
 * SHOULD NOT HANDLE:
 * Fetching GitHub data, mapping file-system nodes, rendering, or navigation.
 * SCALING NOTES:
 * Add new portfolio domain slices here only when multiple features truly need them.
 */

import { create } from "zustand";

const useDataStore = create((set) => ({
  work: null,
  status: "idle",
  error: null,
  isLoaded: false,

  setLoading: () =>
    set({
      status: "loading",
      error: null,
      isLoaded: false,
    }),

  setWork: (data) =>
    set({
      work: data,
      status: "ready",
      error: null,
      isLoaded: true,
    }),

  setError: (error) =>
    set({
      status: "error",
      error,
      isLoaded: false,
    }),

  resetWork: () =>
    set({
      work: null,
      status: "idle",
      error: null,
      isLoaded: false,
    }),
}));

export default useDataStore;

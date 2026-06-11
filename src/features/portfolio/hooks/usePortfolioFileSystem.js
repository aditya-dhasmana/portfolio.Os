/**
 * PURPOSE:
 * Load and expose the portfolio file-system data.
 * RESPONSIBILITY:
 * Coordinate data loading, status, errors, and storage for the Work folder.
 * USED BY:
 * App startup and future portfolio-driven features.
 * DEPENDS ON:
 * Portfolio data builder and data store.
 * SHOULD NOT HANDLE:
 * Rendering, Finder navigation, window behavior, or mobile app stack state.
 * SCALING NOTES:
 * This hook becomes the single place to evolve loading, refresh, retries, or alternate data sources.
 */

import { useCallback } from "react";

import { useDataStore } from "#store";
import { buildWorkLocation } from "../utils/buildWorkLocation";

const hasProjectChildren = (work) => Boolean(work?.children?.length);

export const usePortfolioFileSystem = () => {
  const {
    work,
    status,
    error,
    setLoading,
    setWork,
    setError,
  } = useDataStore();

  const loadPortfolioFileSystem = useCallback(async () => {
    const currentWork = useDataStore.getState().work;
    if (hasProjectChildren(currentWork)) return currentWork;

    setLoading();

    try {
      const nextWork = await buildWorkLocation();
      setWork(nextWork);
      return nextWork;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [setError, setLoading, setWork]);

  return {
    work,
    status,
    error,
    isLoading: status === "loading",
    isLoaded: status === "ready",
    loadPortfolioFileSystem,
  };
};

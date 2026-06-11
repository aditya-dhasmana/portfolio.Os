/**
 * PURPOSE:
 * Own desktop shell window state.
 * RESPONSIBILITY:
 * Open, close, focus, minimize, restore, move, resize, and maximize desktop windows.
 * USED BY:
 * Desktop shell components, window wrapper, dock, navbar, and desktop app windows.
 * DEPENDS ON:
 * Zustand and desktop window config.
 * SHOULD NOT HANDLE:
 * Portfolio data, Finder location history, mobile navigation, or rendering app content.
 * SCALING NOTES:
 * Keep cross-window coordination here. Move app-specific state into the feature that owns that app.
 */

import { create } from "zustand";

import {
  DEFAULT_WINDOW_SIZES,
  INITIAL_Z_INDEX,
  WINDOW_CONFIG,
} from "../config/windowConfig";

let currentZIndex = INITIAL_Z_INDEX;

const getCenteredPosition = (name, size) => {
  if (typeof window === "undefined") return null;

  const windowSize =
    size || DEFAULT_WINDOW_SIZES[name] || { width: 800, height: 600 };
  const navHeight = 42;
  const dockSpace = 112;
  const availableHeight = Math.max(
    420,
    window.innerHeight - navHeight - dockSpace
  );

  return {
    x: Math.max(18, Math.round((window.innerWidth - windowSize.width) / 2)),
    y: Math.max(
      navHeight + 14,
      Math.round(navHeight + (availableHeight - windowSize.height) / 2)
    ),
  };
};

const useWindowStore = create((set) => ({
  windows: WINDOW_CONFIG,

  openWindow: (name, data = null) => {
    currentZIndex += 1;

    set((state) => {
      const current = state.windows[name];
      if (!current) return state;

      return {
        windows: {
          ...state.windows,
          [name]: {
            ...current,
            isOpen: true,
            isMinimized: false,
            data,
            zIndex: currentZIndex,
            position: getCenteredPosition(name, current.size),
          },
        },
      };
    });
  },

  closeWindow: (name) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [name]: {
          ...state.windows[name],
          isOpen: false,
          isMinimized: false,
        },
      },
    }));
  },

  focusWindow: (name) => {
    currentZIndex += 1;

    set((state) => ({
      windows: {
        ...state.windows,
        [name]: {
          ...state.windows[name],
          zIndex: currentZIndex,
        },
      },
    }));
  },

  minimizeWindow: (name) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [name]: {
          ...state.windows[name],
          isMinimized: true,
        },
      },
    }));
  },

  restoreWindow: (name) => {
    currentZIndex += 1;

    set((state) => ({
      windows: {
        ...state.windows,
        [name]: {
          ...state.windows[name],
          isOpen: true,
          isMinimized: false,
          zIndex: currentZIndex,
          position:
            state.windows[name]?.position ||
            getCenteredPosition(name, state.windows[name]?.size),
        },
      },
    }));
  },

  setWindowPosition: (name, position) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [name]: {
          ...state.windows[name],
          position,
        },
      },
    }));
  },

  setWindowSize: (name, size) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [name]: {
          ...state.windows[name],
          size,
        },
      },
    }));
  },

  setSizeMode: (name, sizeMode) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [name]: {
          ...state.windows[name],
          sizeMode,
        },
      },
    }));
  },

  toggleMaximize: (name) => {
    set((state) => {
      const current = state.windows[name];
      if (!current) return state;

      return {
        windows: {
          ...state.windows,
          [name]: {
            ...current,
            sizeMode: current.sizeMode === "full" ? "normal" : "full",
          },
        },
      };
    });
  },
}));

export default useWindowStore;

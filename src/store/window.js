import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// 👇 your existing config
import { WINDOW_CONFIG, INITIAL_Z_INDEX, DEFAULT_WINDOW_SIZES, WINDOW_STACK_OFFSETS } from "#constants";

// Store original sizes for restore functionality
const originalSizes = new Map();

const useWindowStore = create(
  immer((set) => ({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_Z_INDEX + 1,

    // 🟢 OPEN WINDOW
    openWindow: (id) =>
      set((state) => {
        const win = state.windows[id];
        if (!win) return;

        const w = window.innerWidth;
        const h = window.innerHeight;

        // Always set default size for new windows
        if (!win.size) {
          win.size = DEFAULT_WINDOW_SIZES[id] || { width: 800, height: 600 };
        }
        const width = win.size.width;
        const height = win.size.height;

        // Always center window when opening for the first time or if position is null
       if (!win.position || win.position === null) {
        const baseCenterX = (w - width) / 2;
        const baseCenterY = (h - height) / 2 - 30;

        const offset = WINDOW_STACK_OFFSETS[id] || { x: 0, y: 0 };

        win.position = {
          x: baseCenterX + offset.x,
          y: baseCenterY + offset.y,
        };
        win.lastNormalPosition = { ...win.position };
        win.lastNormalSize = { ...win.size };
        }else {
          // Check if existing position is out of bounds and fix it
          const x = win.position.x;
          const y = win.position.y;
          const isOutOfView =
            x + width < 100 ||
            y + height < 100 ||
            x > w - 100 ||
            y > h - 100;

          if (isOutOfView) {
            const baseCenterX = (w - width) / 2;
            const baseCenterY = (h - height) / 2 - 30;
            const offset = WINDOW_STACK_OFFSETS[id] || { x: 0, y: 0 };
            
            win.position = {
            x: baseCenterX + offset.x,
            y: baseCenterY + offset.y,
          };
          }
        }

        win.isOpen = true;





        win.zIndex = state.nextZIndex++;
      }),

    // 🔴 CLOSE WINDOW (DO NOT RESET SIZE/POSITION)
    closeWindow: (id) =>
      set((state) => {
        const win = state.windows[id];
        if (!win) return;

        win.isOpen = false;
        win.isMinimized = false;
      }),

    // 🟡 MINIMIZE
    minimizeWindow: (id) =>
      set((state) => {
        const win = state.windows[id];
        if (!win) return;

        win.isMinimized = true;
      }),

    // 🔵 RESTORE (optional helper)
    restoreWindow: (id) =>
      set((state) => {
        const win = state.windows[id];
        if (!win) return;

        win.isOpen = true;
        win.isMinimized = false;

        win.zIndex = state.nextZIndex++;
      }),

    // 🟣 MAXIMIZE / RESTORE
    toggleMaximize: (id) =>
        set((state) => {
          const win = state.windows[id];
          if (!win) return;

          if (win.sizeMode === "full") {
            // restore latest remembered normal state
            win.sizeMode = "normal";
            win.size = win.lastNormalSize || DEFAULT_WINDOW_SIZES[id];
            win.position = win.lastNormalPosition || win.position;
          } else {
            // before going fullscreen, remember current normal state
            win.lastNormalSize = { ...win.size };
            win.lastNormalPosition = win.position ? { ...win.position } : null;
            win.sizeMode = "full";
          }

          win.zIndex = state.nextZIndex++;
      }),

    // 🎯 FOCUS WINDOW
    focusWindow: (id) =>
      set((state) => {
        const win = state.windows[id];
        if (!win || !win.isOpen) return;

        win.zIndex = state.nextZIndex++;
      }),

    // 📦 SET SIZE
    setWindowPosition: (id, pos) =>
    set((state) => {
      const win = state.windows[id];
      if (!win) return;

      win.position = pos;

      if (win.sizeMode === "normal") {
        win.lastNormalPosition = { ...pos };
      }
    }),

    // 📍 SET POSITION
    setWindowPosition: (id, pos) =>
      set((state) => {
        const win = state.windows[id];
        if (!win) return;

        win.position = pos;
      }),

      setLastNormalState: (id, pos, size) =>
      set((state) => {
        const win = state.windows[id];
        if (!win) return;

        win.lastNormalPosition = pos ? { ...pos } : win.lastNormalPosition;
        win.lastNormalSize = size ? { ...size } : win.lastNormalSize;
      }),

    // 🧠 SET SIZE MODE
    setSizeMode: (id, mode) =>
      set((state) => {
        const win = state.windows[id];
        if (!win) return;

        win.sizeMode = mode;
      }),

    // 🧠 ENSURE PROPER WINDOW INITIALIZATION
    initializeWindow: (id) =>
      set((state) => {
        const win = state.windows[id];
        if (!win) return;

        // Ensure window has proper size
        if (!win.size || !win.size.width || !win.size.height) {
          win.size = DEFAULT_WINDOW_SIZES[id] || { width: 800, height: 600 };
        }

        // Ensure window has proper position
        if (!win.position) {
          const w = window.innerWidth;
          const h = window.innerHeight;
          const width = win.size.width;
          const height = win.size.height;
          
          win.position = {
            x: (w - width) / 2,
            y: (h - height) / 2,
          };
        }

        // Store original size for maximize/restore
        if (!originalSizes.has(id)) {
          originalSizes.set(id, {
            size: { ...win.size },
            position: win.position ? { ...win.position } : null
          });
        }
      }),
  }))
);

export default useWindowStore;
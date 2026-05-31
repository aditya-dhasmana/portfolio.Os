import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useLocationStore = create(
  immer((set) => ({
    activeLocation: null,
    history: [],

    setActiveLocation: (location = null) =>
      set((state) => {
        if (state.activeLocation && location?.id !== state.activeLocation.id) {
          state.history.push(state.activeLocation);
        }

        state.activeLocation = location;
      }),

    goBackLocation: () =>
      set((state) => {
        if (state.history.length === 0) return;

        const prev = state.history[state.history.length - 1];
        state.history.pop();
        state.activeLocation = prev;
      }),

    jumpToLocation: (location) =>
      set((state) => {
        state.activeLocation = location;
      }),

    resetActiveLocation: (defaultLocation) =>
      set((state) => {
        state.activeLocation = defaultLocation;
        state.history = [];
      }),
  }))
);

export default useLocationStore;
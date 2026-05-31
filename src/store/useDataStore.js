import { create } from "zustand";

const useDataStore = create((set) => ({
  work: null,
  isLoaded: false,

  setWork: (data) =>
    set({
      work: data,
      isLoaded: true,
    }),
}));

export default useDataStore;
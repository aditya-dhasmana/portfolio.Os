import { locations } from "#constants";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const DEFAULT_LOCATION = locations.work

const useLocationStore = create(immer((set)=>(
    {  
        activeLocation: locations.work,

        setActiveLocation: (location = null) => set((state)=>{
            state.activeLocation = location;
        }),

        resetActiveLocation : () =>set((state)=>{
            state.setActiveLocation = DEFAULT_LOCATION;
        })
      }
)));

export default useLocationStore;
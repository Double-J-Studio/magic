import { create } from "zustand";

export interface AlertInformation {
  description?: string;
  pathname?: string;
}

interface UseAlertStoreProps {
  isOpen: boolean;
  information: AlertInformation;

  open: () => void;
  close: () => void;
  toggle: () => void;
  setInformation: (information: AlertInformation) => void;
}

const useAlertStore = create<UseAlertStoreProps>()((set) => ({
  isOpen: false,
  information: {},

  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false })),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setInformation: (information) => {
    set((state) => ({
      ...state,
      information: information,
    }));
  },
}));

export default useAlertStore;

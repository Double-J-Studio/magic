import { create } from "zustand";

interface UseSettingsStoreProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const useSettingsStore = create<UseSettingsStoreProps>()((set) => ({
  isOpen: false,

  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false })),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useSettingsStore;

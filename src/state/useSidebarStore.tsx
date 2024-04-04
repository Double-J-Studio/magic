import { create } from "zustand";

interface UseSideBarStoreProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const useSideBarStore = create<UseSideBarStoreProps>()((set) => ({
  isOpen: true,

  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false })),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useSideBarStore;

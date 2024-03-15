import { create } from "zustand";

interface UseDialogStoreProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const useDialogStore = create<UseDialogStoreProps>()((set) => ({
  isOpen: false,

  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false })),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useDialogStore;

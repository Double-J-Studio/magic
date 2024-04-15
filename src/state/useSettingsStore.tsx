import { create } from "zustand";

interface UseSettingsStoreProps {
  isOpen: boolean;
  userName: string;
  profileImageUrl: string | null;
  selectedMenuItem: string;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setUserName: (name: string) => void;
  setProfileImageUrl: (imageUrl: string | null) => void;
  setSelectedMenuItem: (menuItem: string) => void;
}

const useSettingsStore = create<UseSettingsStoreProps>()((set) => ({
  isOpen: false,
  userName: "User",
  profileImageUrl: "",
  selectedMenuItem: "profile",

  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false })),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setUserName: (name) => {
    set((state) => ({ ...state, userName: name }));
  },
  setProfileImageUrl: (imageUrl) => {
    set((state) => ({ ...state, profileImageUrl: imageUrl }));
  },
  setSelectedMenuItem: (menuItem) => {
    set((state) => ({
      ...state,
      selectedMenuItem: menuItem,
    }));
  },
}));

export default useSettingsStore;

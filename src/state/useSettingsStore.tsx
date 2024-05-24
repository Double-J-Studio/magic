import { create } from "zustand";

interface UseSettingsStoreProps {
  isOpen: boolean;
  isLoading: boolean;
  userName: string;
  profileImageUrl: string | null;
  selectedMenuItem: string;
  ollamaVersion: string;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setUserName: (name: string) => void;
  setProfileImageUrl: (imageUrl: string | null) => void;
  setSelectedMenuItem: (menuItem: string) => void;
  setOllamaVersion: (version: string) => void;
  setIsLoading: (loading: boolean) => void;
}

const useSettingsStore = create<UseSettingsStoreProps>()((set) => ({
  isOpen: false,
  isLoading: false,
  userName: "User",
  profileImageUrl: "",
  selectedMenuItem: "profile",
  ollamaVersion: "",

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
  setOllamaVersion: (version) => {
    set((state) => ({ ...state, ollamaVersion: version }));
  },
  setIsLoading: (loading) => {
    set((state) => ({ ...state, isLoading: loading }));
  },
}));

export default useSettingsStore;

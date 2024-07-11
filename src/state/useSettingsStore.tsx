import { create } from "zustand";

export interface Assistant {
  id: string;
  name: string;
  instructions: string;
}

interface UseSettingsStoreProps {
  isOpen: boolean;
  isLoading: boolean;
  userName: string;
  profileImageUrl: string | null;
  selectedMenuItem: string;
  ollamaVersion: string;
  assistants: Assistant[];

  open: () => void;
  close: () => void;
  toggle: () => void;
  setUserName: (name: string) => void;
  setProfileImageUrl: (imageUrl: string | null) => void;
  setSelectedMenuItem: (menuItem: string) => void;
  setOllamaVersion: (version: string) => void;
  setIsLoading: (loading: boolean) => void;
  setAssistants: (assistants: Assistant[]) => void;
}

const useSettingsStore = create<UseSettingsStoreProps>()((set) => ({
  isOpen: false,
  isLoading: false,
  userName: "User",
  profileImageUrl: "",
  selectedMenuItem: "profile",
  ollamaVersion: "",
  assistants: [],

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
  setAssistants: (assistants) => {
    set((state) => ({
      ...state,
      assistants: assistants,
    }));
  },
}));

export default useSettingsStore;

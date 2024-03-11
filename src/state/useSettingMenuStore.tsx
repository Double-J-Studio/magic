import { create } from "zustand";

interface UseSettingMenuStoreProps {
  selectedMenuItem: string;
  setSelectedMenuItem: (menuItem: string) => void;
}

const useSettingMenuStore = create<UseSettingMenuStoreProps>()((set) => ({
  selectedMenuItem: "",

  setSelectedMenuItem: (menuItem) => {
    set((state) => ({
      ...state,
      selectedMenuItem: menuItem,
    }));
  },
}));

export default useSettingMenuStore;

import { create } from "zustand";

interface UseSelectedModelStoreProps {
  // model: "gpt-3.5-turbo" | "gpt-4-turbo-preview";
  model: string;
  setModel: (model: string) => void;
}

const useSelectedModelStore = create<UseSelectedModelStoreProps>()((set) => ({
  model: "gpt-3.5-turbo",

  setModel: (model) => {
    set((state) => ({ ...state, model: model }));
  },
}));

export default useSelectedModelStore;

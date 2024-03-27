import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UseSelectedModelStoreProps {
  model: string;
  setModel: (model: string) => void;
}

const useSelectedModelStore = create<UseSelectedModelStoreProps>()(
  persist(
    (set) => ({
      model: "gpt-3.5-turbo",
      setModel: (model) => {
        set((state) => ({ ...state, model: model }));
      },
    }),
    {
      name: "model",
    }
  )
);

export default useSelectedModelStore;

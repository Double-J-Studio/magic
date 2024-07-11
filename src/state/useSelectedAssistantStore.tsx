import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Assistant } from "@/state/useSettingsStore";

interface UseSelectedAssistantStore {
  assistant: Assistant;
  setAssistant: (assistant: Assistant) => void;
}

const useSelectedAssistantStore = create<UseSelectedAssistantStore>()(
  persist(
    (set) => ({
      assistant: {
        id: "#default",
        name: "default",
        instructions:
          "You are a helpful AI. Please answer in the language I asked.",
      },
      setAssistant: (assistant) => {
        set((state) => ({ ...state, assistant: assistant }));
      },
    }),
    {
      name: "selectedAssistant",
    }
  )
);

export default useSelectedAssistantStore;

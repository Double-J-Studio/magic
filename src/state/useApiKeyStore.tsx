import { create } from "zustand";

export interface ApiKey {
  service: string;
  key: string;
}

interface UseApiKeyStoreProps {
  apiKeys: ApiKey[];
  getOpenaiApiKey: () => string;
  getBingApiKey: () => string;
  getGroqApiKey: () => string;
  getGeminiApiKey: () => string;
  setApiKeys: (apiKeys: ApiKey[]) => void;
}

const useApiKeyStore = create<UseApiKeyStoreProps>()((set, get) => ({
  apiKeys: [
    {
      service: "openai",
      key: "",
    },
    {
      service: "bing",
      key: "",
    },
    {
      service: "groq",
      key: "",
    },
    {
      service: "gemini",
      key: "",
    },
  ],

  getOpenaiApiKey: () => {
    return get().apiKeys[0].key;
  },
  getBingApiKey: () => {
    return get().apiKeys[1].key;
  },
  getGroqApiKey: () => {
    return get().apiKeys[2].key;
  },
  getGeminiApiKey: () => {
    return get().apiKeys[3].key;
  },
  setApiKeys: (apiKeys) => {
    set((state) => ({ ...state, apiKeys: apiKeys }));
  },
}));

export default useApiKeyStore;

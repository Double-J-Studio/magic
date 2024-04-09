import { create } from "zustand";

export interface ApiKey {
  service: string;
  key: string;
}

interface UseApiKeyStoreProps {
  apiKeys: ApiKey[];
  getApiKey: (service: string) => string;
  setApiKeys: (apiKeys: ApiKey[]) => void;
}

const useApiKeyStore = create<UseApiKeyStoreProps>()((set, get) => ({
  apiKeys: [
    {
      service: "openai",
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

  getApiKey: (service: string) => {
    return get().apiKeys.filter((apiKey) => apiKey.service === service)?.[0]
      ?.key;
  },
  setApiKeys: (apiKeys) => {
    set((state) => ({ ...state, apiKeys: apiKeys }));
  },
}));

export default useApiKeyStore;

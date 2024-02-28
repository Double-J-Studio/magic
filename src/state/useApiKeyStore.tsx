import { create } from "zustand";

export interface ApiKey {
  service: string;
  key: string;
}

interface UseApiKeyStoreProps {
  apiKeys: ApiKey[];
  setApiKeys: (apiKeys: ApiKey[]) => void;
}

const useApiKeyStore = create<UseApiKeyStoreProps>()((set) => ({
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
  ],
  setApiKeys: (apiKeys) => {
    set((state) => ({ ...state, apiKeys: apiKeys }));
  },
}));

export default useApiKeyStore;

import { kv } from "@/utils/tauri/kv";

import { ApiKey } from "@/state/useApiKeyStore";




export function checkApiKeys(setApiKeys: (apiKeys: ApiKey[]) => void) {
  kv.get<ApiKey[]>("api_keys").then((apiKeys) => {
    if (!apiKeys) {
      return;
    }

    if (apiKeys) {
      const services = ["openai", "bing", "groq"];
      if (apiKeys.length < services.length) {
        const existedServices = apiKeys.map((apiKey) => apiKey.service);
        const filteredServices = services.filter(
          (service) => !existedServices.includes(service)
        );

        if (filteredServices.length > 0) {
          filteredServices.forEach((service) => {
            apiKeys.push({ key: "", service: service });
          });
        }
      }

      setApiKeys(apiKeys);
    }
  });
}

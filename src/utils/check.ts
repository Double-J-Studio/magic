import { kv } from "@/utils/tauri/kv";

import { ApiKey } from "@/state/useApiKeyStore";

import { MODELS } from "@/constant";

export function checkApiKeys(setApiKeys: (apiKeys: ApiKey[]) => void) {
  kv.get<ApiKey[]>("api_keys").then((apiKeys) => {
    if (!apiKeys) {
      return;
    }

    if (apiKeys) {
      const services = ["openai", "bing", "groq", "gemini"];
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

type Service = "gpt" | "dalle" | "openai" | "groq" | "gemini" | "ollama";

export function isCheckModel(service: Service, model: string) {
  const IS_GPT_MODEL = model === MODELS["GPT-3.5"] || model === MODELS["GPT-4"];
  const IS_DALLE_MODEL = model === MODELS["DALL-E-3"];
  const IS_OPENAI_MODEL = IS_GPT_MODEL || IS_DALLE_MODEL;
  const IS_GROQ_MODEL = model === MODELS.LLAMA2 || model === MODELS.MIXTRAL;
  const IS_GEMINI_MODEL = model === MODELS.GEMINI;
  const IS_OLLAMA_MODEL = model.includes("olama");

  switch (service) {
    case "gpt":
      return IS_GPT_MODEL;
    case "dalle":
      return IS_DALLE_MODEL;
    case "openai":
      return IS_OPENAI_MODEL;
    case "groq":
      return IS_GROQ_MODEL;
    case "gemini":
      return IS_GEMINI_MODEL;
    case "ollama":
      return IS_OLLAMA_MODEL;
  }
}

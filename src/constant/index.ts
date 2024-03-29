export const ROUTES = {
  MAIN: "/",
  API_KEY_SETTING: "/setting/api-key-setting",
  IMAGE_GALLERY: "/setting/image-gallery",
};

export const MODELS = {
  "GPT-3.5": "gpt-3.5-turbo",
  "GPT-4": "gpt-4-turbo-preview",
  "DALL-E-3": "dall-e-3",
  BING: "bing",
  LLAMA2: "llama2-70b-4096",
  MIXTRAL: "mixtral-8x7b-32768",
  GEMINI: "gemini-pro",
};

interface GroupedModelsByPlatform {
  [key: string]: { [key: string]: string }[];
}

export const GROUPED_MODELS_BY_PLATFORM: GroupedModelsByPlatform = {
  OpenAI: [
    { id: "1", name: "GPT-3.5", model: "gpt-3.5-turbo" },
    { id: "2", name: "GPT-4", model: "gpt-4-turbo-preview" },
    { id: "3", name: "DALL·E 3", model: "dall-e-3" },
  ],
  Microsoft: [{ id: "4", name: "Bing", model: "bing" }],
  Groq: [
    { id: "5", name: "LLaMA2", model: "llama2-70b-4096" },
    { id: "6", name: "Mixtral", model: "mixtral-8x7b-32768" },
  ],
  Google: [{ id: "7", name: "Gemini", model: "gemini-pro" }],
};

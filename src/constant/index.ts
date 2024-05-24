export const MENU_LIST = [
  { id: "1", value: "profile", name: "Profile" },
  { id: "2", value: "api-key-setting", name: "API Key Setting" },
  { id: "3", value: "image-gallery", name: "Image Gallery" },
  { id: "4", value: "ollama", name: "Ollama" },
];

export const MODELS = {
  "GPT-3.5": "gpt-3.5-turbo",
  "GPT-4": "gpt-4-turbo-preview",
  "DALL-E-3": "dall-e-3",
  LLAMA2: "llama2-70b-4096",
  MIXTRAL: "mixtral-8x7b-32768",
  GEMINI: "gemini-pro",
};

export interface GroupedModelsByPlatform {
  [key: string]: { [key: string]: string }[];
}

export const GROUPED_MODELS_BY_PLATFORM: GroupedModelsByPlatform = {
  OpenAI: [
    { id: "1", name: "GPT-3.5", model: "gpt-3.5-turbo" },
    { id: "2", name: "GPT-4", model: "gpt-4-turbo-preview" },
    { id: "3", name: "DALL·E 3", model: "dall-e-3" },
  ],
  Groq: [
    { id: "4", name: "LLaMA2", model: "llama2-70b-4096" },
    { id: "5", name: "Mixtral", model: "mixtral-8x7b-32768" },
  ],
  Google: [{ id: "6", name: "Gemini", model: "gemini-pro" }],
};

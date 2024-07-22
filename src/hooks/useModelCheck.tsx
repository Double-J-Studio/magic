import useModels from "@/hooks/useModels";

type Service =
  | "gpt"
  | "dalle"
  | "openai"
  | "groq"
  | "gemini"
  | "ollama"
  | "claude";

const useModelCheck = () => {
  const { models } = useModels();

  const isCheckModel = (service: Service, model: string) => {
    const IS_GPT_MODEL =
      model === models["GPT-3.5"] ||
      model === models["GPT-4"] ||
      model === models["GPT-4O"];
    const IS_DALLE_MODEL = model === models["DALL-E-3"];
    const IS_OPENAI_MODEL = IS_GPT_MODEL || IS_DALLE_MODEL;
    const IS_GROQ_MODEL = model === models.LLAMA3 || model === models.MIXTRAL;
    const IS_GEMINI_MODEL = model === models.GEMINI;
    const IS_OLLAMA_MODEL = model.includes("olama");
    const IS_CLAUDE_MODEL = model === models.CLAUDE;

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
      case "claude":
        return IS_CLAUDE_MODEL;
    }
  };

  return { isCheckModel };
};

export default useModelCheck;

import { OpenAI, Dalle, Mistral, Gemini, Meta, Ollama } from "@lobehub/icons";
import { UserCircleIcon } from "@heroicons/react/20/solid";

import useModels from "@/hooks/useModels";

interface ModelIconProps {
  model?: string;
  size?: number;
}

const ModelIcon = ({ model, size = 16 }: ModelIconProps) => {
  const { models } = useModels();

  switch (true) {
    case model === models["GPT-3.5"]:
      return <OpenAI.Avatar size={size} type="gpt3" />;

    case model === models["GPT-4"]:
      return <OpenAI.Avatar size={size} type="gpt4" />;

    case model === models["GPT-4O"]:
      return <OpenAI.Avatar size={size} />;

    case model === models["DALL-E-3"]:
      return <Dalle.Avatar size={size} />;

    case model === models.MIXTRAL:
      return <Mistral.Avatar size={size} />;

    case model === models.GEMINI:
      return <Gemini.Avatar size={size} />;

    case model === models.LLAMA3:
      return <Meta.Color size={size} />;

    case model?.includes("ollama"):
      return <Ollama.Avatar size={size} />;

    default:
      return <UserCircleIcon className="text-white bg-green-500 rounded-md" />;
  }
};

export default ModelIcon;

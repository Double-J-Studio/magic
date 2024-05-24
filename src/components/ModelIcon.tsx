import { OpenAI, Dalle, Mistral, Gemini, Meta, Ollama } from "@lobehub/icons";
import { UserCircleIcon } from "@heroicons/react/20/solid";

import { MODELS } from "@/constant";

interface ModelIconProps {
  model?: string;
  size?: number;
}

function ModelIcon({ model, size = 16 }: ModelIconProps) {
  switch (true) {
    case model === MODELS["GPT-3.5"]:
      return <OpenAI.Avatar size={size} type="gpt3" />;

    case model === MODELS["GPT-4"]:
      return <OpenAI.Avatar size={size} type="gpt4" />;

    case model === MODELS["DALL-E-3"]:
      return <Dalle.Avatar size={size} />;

    case model === MODELS.MIXTRAL:
      return <Mistral.Avatar size={size} />;

    case model === MODELS.GEMINI:
      return <Gemini.Avatar size={size} />;

    case model === MODELS.LLAMA2:
      return <Meta.Color size={size} />;

    case model?.includes("ollama"):
      return <Ollama.Avatar size={size} />;

    default:
      return <UserCircleIcon className="text-white bg-green-500 rounded-md" />;
  }
}

export default ModelIcon;

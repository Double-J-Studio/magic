import { OpenAI, Dalle, Mistral, Gemini, Bing, Meta } from "@lobehub/icons";
import { UserCircleIcon } from "@heroicons/react/20/solid";

import { MODELS } from "@/constant";

interface ModelIconProps {
  model?: string;
  size?: number;
}

function ModelIcon({ model, size = 16 }: ModelIconProps) {
  switch (model) {
    case MODELS["GPT-3.5"]:
      return <OpenAI.Avatar size={size} type="gpt3" />;

    case MODELS["GPT-4"]:
      return <OpenAI.Avatar size={size} type="gpt4" />;

    case MODELS["DALL-E-3"]:
      return <Dalle.Avatar size={size} />;

    case MODELS.MIXTRAL:
      return <Mistral.Avatar size={size} />;

    case MODELS.GEMINI:
      return <Gemini.Avatar size={size} />;

    case MODELS.BING:
      return <Bing.Color size={size} />;

    case MODELS.LLAMA2:
      return <Meta.Color size={size} />;

    default:
      return <UserCircleIcon className="text-white bg-green-500 rounded-md" />;
  }
}

export default ModelIcon;

import { useEffect, useState } from "react";

import { getOllamaModels } from "@/utils/tauri/ollama";
import { convertToUpper, removePatterns } from "@/utils/convert";
import { getTotalObjectCount } from "@/utils/count";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ModelIcon from "@/components/ModelIcon";

import useSelectedModelStore from "@/state/useSelectedModelStore";

import {
  GROUPED_MODELS_BY_PLATFORM,
  GroupedModelsByPlatform,
} from "@/constant";

const ChatSelect = () => {
  const [groupedModelsByPlatform, setGroupedModelsByPlatform] =
    useState<GroupedModelsByPlatform>({});

  const { model, setModel } = useSelectedModelStore();

  useEffect(() => {
    async function groupingModels() {
      try {
        const ollamaModels = await getOllamaModels();

        const modifiedOllamaModels = (
          ollamaModels as { [key: string]: string }[]
        )?.map((model, i) => {
          return {
            id: String(i + getTotalObjectCount(GROUPED_MODELS_BY_PLATFORM) + 1),
            name: convertToUpper(
              removePatterns(model.name, ":latest"),
              "l",
              "m"
            ),
            model: `ollama-${model.name}`,
          };
        });

        setGroupedModelsByPlatform({
          ...GROUPED_MODELS_BY_PLATFORM,
          Ollama: modifiedOllamaModels,
        });
      } catch (err) {
        console.error(err);
      }
    }

    groupingModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleValueChange = (value: string) => {
    setModel(value);
  };

  return (
    <Select onValueChange={handleValueChange} defaultValue={model}>
      <SelectTrigger
        className="w-[150px] border-0 text-lg font-bold hover:bg-accent hover:text-accent-foreground focus-visible:ring-transparent focus:ring-transparent"
        aria-label="Select Model"
      >
        <SelectValue
          placeholder={model === "gpt-3.5-turbo" ? "GPT-3.5" : "GPT-4.0"}
        />
      </SelectTrigger>
      <SelectContent className="w-[200px]">
        {Object.keys(groupedModelsByPlatform).map((platform) => {
          return (
            <SelectGroup key={platform}>
              <SelectLabel>{platform}</SelectLabel>
              {groupedModelsByPlatform[platform].map((model) => {
                return (
                  <SelectItem
                    key={`${platform}_${model.name}`}
                    value={model.model}
                    className="pl-10 cursor-pointer"
                  >
                    <div className="flex items-center gap-x-2">
                      <ModelIcon model={model.model} size={16} />
                      {model.name}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default ChatSelect;

import { useEffect, useState } from "react";

import { getOllamaModels } from "@/utils/tauri/ollama";
import { convertToUpper, removePatterns } from "@/utils/convert";
import { getTotalObjectCount } from "@/utils/count";
import {
  GroupedModelsByPlatform,
  useGetGroupedModelsByPlatform,
} from "@/hooks/db/useGetGroupedModelsByPlatform";

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
import { Skeleton } from "@/components/ui/skeleton";

import useSelectedModelStore from "@/state/useSelectedModelStore";

const ChatSelect = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [groupedModels, setGroupedModels] = useState<GroupedModelsByPlatform>(
    {}
  );

  const { model, setModel } = useSelectedModelStore();

  const { groupedModelsByPlatform } = useGetGroupedModelsByPlatform();

  useEffect(() => {
    async function groupingModels() {
      try {
        const ollamaModels = await getOllamaModels();
        const GROUPED_MODELS_BY_PLATFORM =
          groupedModelsByPlatform as GroupedModelsByPlatform;

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

        setGroupedModels({
          ...GROUPED_MODELS_BY_PLATFORM,
          Ollama: modifiedOllamaModels,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (groupedModelsByPlatform) {
      groupingModels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupedModelsByPlatform]);

  const handleValueChange = (value: string) => {
    setModel(value);
  };

  return isLoading ? (
    <Skeleton className="min-w-[150px] h-10" />
  ) : (
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
        {Object.keys(groupedModels).map((platform) => {
          return (
            <SelectGroup key={platform}>
              <SelectLabel>{platform}</SelectLabel>
              {groupedModels[platform].map((model) => {
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

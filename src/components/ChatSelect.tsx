import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useSelectedModelStore from "@/state/useSelectedModelStore";

import { GROUPED_MODELS_BY_PLATFORM } from "@/constant";

const ChatSelect = () => {
  const { model, setModel } = useSelectedModelStore();

  const handleValueChange = (value: string) => {
    setModel(value);
  };

  return (
    <Select onValueChange={handleValueChange} defaultValue={model}>
      <SelectTrigger className="w-[130px] border-0 text-lg font-bold hover:bg-accent hover:text-accent-foreground focus-visible:ring-transparent focus:ring-transparent">
        <SelectValue
          placeholder={model === "gpt-3.5-turbo" ? "GPT-3.5" : "GPT-4.0"}
        />
      </SelectTrigger>
      <SelectContent className="w-[200px]">
        {Object.keys(GROUPED_MODELS_BY_PLATFORM).map((platform) => {
          return (
            <SelectGroup key={platform}>
              <SelectLabel>{platform}</SelectLabel>
              {GROUPED_MODELS_BY_PLATFORM[platform].map((model) => {
                return (
                  <SelectItem
                    key={`${platform}_${model.name}`}
                    value={model.model}
                    className="pl-10 cursor-pointer"
                  >
                    {model.name}
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

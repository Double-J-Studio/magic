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
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Models</SelectLabel>
          <SelectItem value="gpt-3.5-turbo" className="cursor-pointer">
            GPT-3.5
          </SelectItem>
          <SelectItem value="gpt-4-turbo-preview" className="cursor-pointer">
            GPT-4
          </SelectItem>
          <SelectItem value="dall-e-3" className="cursor-pointer">
            DALL·E 3
          </SelectItem>
          <SelectItem value="bing" className="cursor-pointer">
            Bing
          </SelectItem>
          <SelectItem value="llama2-70b-4096" className="cursor-pointer">
            LLaMA2
          </SelectItem>
          <SelectItem value="mixtral-8x7b-32768" className="cursor-pointer">
            Mixtral
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ChatSelect;

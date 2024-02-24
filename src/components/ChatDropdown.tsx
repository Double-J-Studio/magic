import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSelectedModelStore from "@/state/useSelectedModelStore";

const ChatDropdown = () => {
  const { model, setModel } = useSelectedModelStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-lg font-bold focus-visible:ring-transparent"
        >
          <span>{model === "gpt-3.5-turbo" ? "GPT-3.5" : "GPT-4.0"}</span>
          <ChevronDownIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 !translate-x-0">
        <DropdownMenuLabel>Models</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
          <DropdownMenuRadioItem
            value="gpt-3.5-turbo"
            className="cursor-pointer"
          >
            GPT-3.5
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="gpt-4-turbo-preview"
            className="cursor-pointer"
          >
            GPT-4.0
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatDropdown;

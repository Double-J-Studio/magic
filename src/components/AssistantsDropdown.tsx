import { useEffect } from "react";

import { PlusIcon } from "@heroicons/react/20/solid";

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
import Tooltip from "@/components/Tooltip";

import useSettingsStore from "@/state/useSettingsStore";
import useSelectedAssistantStore from "@/state/useSelectedAssistantStore";

const AssistantsDropdown = () => {
  const { assistants, setAssistants } = useSettingsStore();
  const { assistant, setAssistant } = useSelectedAssistantStore();

  useEffect(() => {
    function getAssistants() {
      const assistants = localStorage.getItem("assistants");
      if (assistants) {
        const results = JSON.parse(assistants);
        setAssistants(results);
      }
    }

    getAssistants();
  }, [setAssistants]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:!ring-transparent focus:!ring-transparent">
        <Tooltip description="Assistant" side="top" sideOffset={10}>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-lg font-bold focus-visible:ring-transparent focus:ring-transparent"
          >
            <PlusIcon className="w-6 h-6 bg-transparent" />
          </Button>
        </Tooltip>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 !translate-x-0 focus-visible:ring-transparent focus:ring-transparent"
        sideOffset={10}
      >
        <DropdownMenuLabel>Assistant</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={assistant.id}
          onValueChange={(assistantId: string) => {
            const found = assistants.find(
              (assistant) => assistant.id === assistantId
            );
            if (found) {
              setAssistant(found);
            }
          }}
        >
          {assistants?.map((assistant) => {
            return (
              <DropdownMenuRadioItem
                key={assistant.id}
                value={assistant.id}
                className="flex flex-col items-start cursor-pointer"
              >
                <div className="text-sm font-semibold">
                  {assistant.name || "Untitled Assistant"}
                </div>
                <div className="text-xs line-clamp-3">
                  {assistant.instructions}
                </div>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AssistantsDropdown;

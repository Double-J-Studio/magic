import { MouseEvent } from "react";

import dayjs from "dayjs";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { TooltipArrow } from "@radix-ui/react-tooltip";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ConversationsDialog from "@/components/ConversationsDialog";

import useConversationStore, {
  Conversation,
} from "@/state/useConversationStore";
import useDialogStore from "@/state/useDialogStore";

interface ConversationsProps {
  data: { [key: string]: Conversation[] };
}

const Conversations = ({ data }: ConversationsProps) => {
  const {
    selectedConversationId,
    setSelectedConversationId,
    initSelectedConversationId,
    setDeleteButtonId,
  } = useConversationStore();
  const { open } = useDialogStore();

  const dataKeys = Object.keys(data).map((key) => key);
  const sortedDatakeys: string[] = dataKeys
    .slice()
    .sort((a, b) => dayjs(b).diff(dayjs(a)));

  function getTitle(text: string) {
    const today = dayjs();
    const year = dayjs(text).format("YYYY");
    const yearDiff = dayjs().diff(text, "year");

    if (yearDiff === 0) {
      if (today.isSame(text, "day")) {
        return "Today";
      } else if (today.subtract(1, "day").isSame(text, "day")) {
        return "Yesterday";
      } else if (today.subtract(7, "day").isSame(text, "day")) {
        return "Previous 7 Days";
      } else if (today.subtract(30, "day").isSame(text, "day")) {
        return "Previous 30 Days";
      } else {
        return dayjs(text).format("MMMM");
      }
    } else if (yearDiff === 1) {
      return "Last Year";
    } else {
      return year;
    }
  }

  const handleNewChatBtnClick = () => {
    initSelectedConversationId();
  };

  const handleConversationClick = async (id: number) => {
    setSelectedConversationId(id);
  };

  const handleDialogOpen = (e: MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation();
    setDeleteButtonId(id);
    open();
  };

  return (
    <div className="flex-col flex-1 w-full h-full min-h-[calc(100vh-58px)] max-h-[calc(100vh-58px)] overflow-y-auto">
      <div className="relative pr-3">
        <Button
          type="button"
          variant="ghost"
          className="flex justify-between w-full"
          onClick={handleNewChatBtnClick}
        >
          <span>New Chat</span>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PencilSquareIcon className="w-5 h-5" />
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={25}
                align="center"
                className="bg-black border-black text-gray-100"
              >
                <p>New Chat</p>
                <TooltipArrow className="animate-in fade-in-0 zoom-in-95" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </div>

      {sortedDatakeys?.map((key: string, i) => {
        return (
          <div key={`${key}_${i}`} className="relative mt-5">
            <p className="h-9 pb-2 pt-3 px-2 text-xs font-semibold text-gray-400 text-ellipsis overflow-hidden break-all">
              {getTitle(key)}
            </p>
            <ul className="pr-3">
              {data[key].map(({ name, id }: Conversation, i: number) => (
                <li
                  key={`conversation_${i}`}
                  className={`relative w-full p-2 ${selectedConversationId === id ? "bg-gray-200" : "hover:bg-gray-100"} rounded-lg text-gray-700 text-sm font-medium cursor-pointer group/item`}
                  onClick={() => handleConversationClick(id as number)}
                >
                  <div className="relative grow overflow-hidden whitespace-nowrap">
                    {name}

                    <div
                      className={`absolute top-0 right-0 w-5 h-full bg-gradient-to-r from-transparent ${selectedConversationId === id ? "to-gray-200" : "to-slate-50"}`}
                    />
                    <div
                      className={`z-10 absolute top-[-8px] right-0 flex justify-end w-6 ${selectedConversationId === id ? "bg-gray-200" : "bg-gray-100"} invisible group-hover/item:visible`}
                    >
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-9 p-1 bg-transparent group/button hover:bg-transparent"
                              onClick={(e) => handleDialogOpen(e, id as number)}
                            >
                              <span className="sr-only">대화 삭제</span>
                              <TrashIcon className="w-4 h-4 group-hover/button:text-gray-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            sideOffset={-5}
                            align="center"
                            className="bg-black border-black text-gray-100"
                          >
                            <p>Delete</p>
                            <TooltipArrow className="animate-in fade-in-0 zoom-in-95" />
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <ConversationsDialog />
    </div>
  );
};

export default Conversations;

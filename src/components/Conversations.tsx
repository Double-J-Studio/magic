import dayjs from "dayjs";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { TooltipArrow } from "@radix-ui/react-tooltip";

import { db } from "@/utils/tauri/db";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import useConversationStore, {
  Conversation,
} from "@/state/useConversationStore";
import useMessageStore from "@/state/useMessageStore";

interface ConversationsProps {
  data: { [key: string]: Conversation[] };
}

const Conversations = ({ data }: ConversationsProps) => {
  const { initMessages, setMessages } = useMessageStore();
  const {
    selectedConversationId,
    setSelectedConversationId,
    initSelectedConversationId,
  } = useConversationStore();

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
    initMessages();
  };

  const handleConversationClick = (id: number) => {
    setSelectedConversationId(id);
    db.conversation.message.list(id).then((res) => {
      setMessages(res);
    });
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
                  className={`w-full p-2 ${selectedConversationId === id ? "bg-gray-200" : "hover:bg-gray-100"} rounded-lg text-gray-700 text-sm font-medium cursor-pointer`}
                  onClick={() => handleConversationClick(id as number)}
                >
                  <div className="relative grow overflow-hidden whitespace-nowrap">
                    {name}

                    <div
                      className={`absolute top-0 right-0 w-5 h-full bg-gradient-to-r from-transparent ${selectedConversationId === id ? "to-gray-200" : "to-slate-50"}`}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default Conversations;

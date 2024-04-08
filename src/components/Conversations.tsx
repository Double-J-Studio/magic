import { MouseEvent } from "react";

import dayjs from "dayjs";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";

import { Button } from "@/components/ui/button";
import ConversationsDialog from "@/components/ConversationsDialog";
import Tooltip from "@/components/Tooltip";

import useConversationStore, {
  Conversation,
} from "@/state/useConversationStore";

interface ConversationsProps {
  data: { [key: string]: Conversation[] };
}

const Conversations = ({ data }: ConversationsProps) => {
  const {
    selectedConversationId,
    setSelectedConversationId,
    initSelectedConversationId,
    setDeleteButtonId,
    open,
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
    <div className="relative flex-col flex-1 w-full h-full min-h-[calc(100vh-58px)] max-h-[calc(100vh-58px)] pr-3 overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-gray-100 scrollbar-track-[#fafafa]">
      <div className="relative">
        <Button
          type="button"
          variant="ghost"
          className="flex justify-between w-full"
          onClick={handleNewChatBtnClick}
        >
          <span>New Chat</span>
          <Tooltip description="New Chat" side="right" sideOffset={25}>
            <PencilSquareIcon className="w-5 h-5" />
          </Tooltip>
        </Button>
      </div>

      {sortedDatakeys?.map((key: string, i) => {
        return (
          <div key={`${key}_${i}`} className="relative mt-5">
            <p className="h-9 pb-2 pt-3 px-2 text-xs font-semibold text-gray-400 text-ellipsis overflow-hidden break-all">
              {getTitle(key)}
            </p>
            <ul>
              {data[key].map(({ name, id }: Conversation, i: number) => (
                <li
                  key={`conversation_${i}`}
                  className={`relative w-full p-2 pr-0 ${selectedConversationId === id ? "bg-gray-200" : "hover:bg-gray-100"} rounded-lg text-gray-700 text-sm font-medium cursor-pointer group/item`}
                  onClick={() => handleConversationClick(id as number)}
                >
                  <div className="relative grow overflow-hidden whitespace-nowrap">
                    {name}

                    <div
                      className={`absolute bottom-0 right-0 top-0 bg-gradient-to-l to-transparent w-8 ${selectedConversationId === id ? "from-[#e5e7eb]" : "from-[#f9f9f9]"} from-0% group-hover:w-20 group-hover:from-[#ececec] group-hover:from-60%`}
                    />
                    <div
                      className={`z-10 absolute top-[-8px] right-0 flex justify-end w-6 ${selectedConversationId === id ? "bg-gray-200" : "bg-gray-100"} invisible group-hover/item:visible`}
                    >
                      <Tooltip description="Delete" side="top" sideOffset={-5}>
                        <Button
                          variant="ghost"
                          className="h-9 p-1 bg-transparent group/button hover:bg-transparent"
                          onClick={(e) => handleDialogOpen(e, id as number)}
                        >
                          <span className="sr-only">Delete conversation</span>
                          <TrashIcon className="w-4 h-4 group-hover/button:text-gray-600" />
                        </Button>
                      </Tooltip>
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

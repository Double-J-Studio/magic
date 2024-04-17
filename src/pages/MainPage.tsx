import ScrollToBottom from "react-scroll-to-bottom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

import { useGetMessages } from "@/hooks/db/useGetMessages";

import ChatInput from "@/components/ChatInput";
import ChatSelect from "@/components/ChatSelect";
import ChatView from "@/components/ChatView";
import { Button } from "@/components/ui/button";
import Tooltip from "@/components/Tooltip";

import useConversationStore from "@/state/useConversationStore";
import useSideBarStore from "@/state/useSidebarStore";

const MainPage = () => {
  const { selectedConversationId } = useConversationStore();
  const { isOpen, toggle } = useSideBarStore();

  const { messages } = useGetMessages({ id: selectedConversationId });

  return (
    <main className="relative flex flex-col justify-between min-w-full h-screen p-6">
      <div className="flex justify-start pt-3.5 pb-2">
        <ChatSelect />
      </div>
      {messages &&
        messages.length > 0 &&
        messages[0].conversationId === selectedConversationId && (
          <ScrollToBottom
            className="relative flex-1 overflow-y-auto h-[90%] pb-9"
            followButtonClassName="hidden"
            initialScrollBehavior="auto"
            scrollViewClassName="scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-gray-100 scrollbar-track-white basic"
            key={`scroll_to_bottom_${selectedConversationId}`}
          >
            <ChatView />
          </ScrollToBottom>
        )}

      <ChatInput />

      <div className="absolute top-1/2 left-2 transform -translate-x-1/2 -translate-y-1/2">
        <Tooltip
          description={isOpen ? "Close sidebar" : "Open sidebar"}
          side="right"
          sideOffset={-5}
        >
          <Button
            type="button"
            variant="ghost"
            className="px-1 py-3 hover:bg-transparent"
            onClick={() => toggle()}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? (
              <ChevronLeftIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </Button>
        </Tooltip>
      </div>
    </main>
  );
};

export default MainPage;

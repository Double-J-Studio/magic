import ScrollToBottom from "react-scroll-to-bottom";

import { useGetMessages } from "@/hooks/db/useGetMessages";

import ChatInput from "@/components/ChatInput";
import ChatSelect from "@/components/ChatSelect";
import ChatView from "@/components/ChatView";

import useConversationStore from "@/state/useConversationStore";

const MainPage = () => {
  const { selectedConversationId } = useConversationStore();

  const { messages } = useGetMessages({ id: selectedConversationId });

  return (
    <main className="flex flex-col justify-between w-full h-screen p-6">
      <div className="flex justify-start py-2">
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
    </main>
  );
};

export default MainPage;

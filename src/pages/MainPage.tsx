import { useEffect } from "react";

import ScrollToBottom from "react-scroll-to-bottom";

import { db } from "@/utils/tauri/db";

import ChatInput from "@/components/ChatInput";
import ChatSelect from "@/components/ChatSelect";
import ChatView from "@/components/ChatView";

import useConversationStore from "@/state/useConversationStore";

const MainPage = () => {
  const { setConversations } = useConversationStore();

  useEffect(() => {
    db.conversation
      .list()
      .then((res) => {
        console.log("res", res);
        setConversations(res);
      })
      .catch((err) => console.error("err", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex flex-col justify-between w-full h-screen p-6">
      <div className="flex justify-start py-2">
        <ChatSelect />
      </div>
      <ScrollToBottom
        className="relative flex-1 overflow-y-auto h-[90%] pb-9"
        followButtonClassName="hidden"
        initialScrollBehavior="auto"
      >
        <ChatView />
      </ScrollToBottom>
      <ChatInput />
    </main>
  );
};

export default MainPage;

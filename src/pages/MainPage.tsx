import ScrollToBottom from "react-scroll-to-bottom";

import ChatSelect from "@/components/ChatSelect";
import ChatView from "@/components/ChatView";
import ChatInput from "@/components/ChatInput";
import { useEffect } from "react";
import { db } from "@/utils/tauri/db";

const MainPage = () => {
  useEffect(() => {
    db.conversation
      .list()
      .then((l) => console.log("l", l))
      .catch((err) => console.error("err", err));
  }, []);

  return (
    <main className="flex flex-col justify-between w-full h-screen p-6">
      <div className="flex justify-start py-2">
        <ChatSelect />
      </div>
      <ScrollToBottom
        className="relative flex-1 overflow-y-auto h-[90%] pb-9"
        followButtonClassName="hidden"
      >
        <ChatView />
      </ScrollToBottom>
      <ChatInput />
    </main>
  );
};

export default MainPage;

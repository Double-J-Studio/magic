import { useEffect } from "react";

import { ArrowDownIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import Markdown from "react-markdown";
import { useScrollToBottom, useSticky } from "react-scroll-to-bottom";
import remarkGfm from "remark-gfm";

import { capitalizeFirstLetter } from "@/lib/utils";
import { db } from "@/utils/tauri/db";

import BingMessageComponent from "@/components/BingMessageComponent";
import SkeletonCard from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";

import useMessageStore, { Message } from "@/state/useMessageStore";
import useConversationStore from "@/state/useConversationStore";

const ChatView = () => {
  const scrollToBottom = useScrollToBottom();
  const [sticky] = useSticky();

  const { messages, setMessages } = useMessageStore();
  const { selectedConversationId } = useConversationStore();

  const changeModelName = (model: string) => {
    if (model?.includes("gpt")) {
      return "ChatGPT";
    }

    if (model?.includes("dall")) {
      return "DALL·E 3";
    }

    if (
      model?.includes("llama") ||
      model?.includes("mixtral") ||
      model?.includes("gemini")
    ) {
      return capitalizeFirstLetter(model?.split("-")[0]);
    }

    return capitalizeFirstLetter(model);
  };

  useEffect(() => {
    if (selectedConversationId > 0) {
      db.conversation.message.list(selectedConversationId).then((res) => {
        setMessages(res);
        console.log("res :::::::::::", res);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId]);

  return (
    <>
      {messages.filter((message: Message) => message.role === "assistant")
        .length > 0 &&
        messages.map((message: Message, i: number) => {
          return (
            <div key={`message_${i}`} className="flex gap-2 px-4 py-2">
              <div
                className={`flex justify-center w-6 h-6 ${
                  message.role === "user" ? "bg-slate-200" : "bg-green-500"
                } rounded-full overflow-hidden`}
              >
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>

              <div className="flex flex-col gap-1 w-[calc(100%-32px)]">
                <div className="leading-6 text-gray-700 font-semibold select-none">
                  {message.role === "user"
                    ? capitalizeFirstLetter(message.role)
                    : changeModelName(message.model as string)}
                </div>
                {message.imageUrls &&
                  (!message.isLoading ? (
                    <img
                      src={message.imageUrls}
                      alt="dall-e3_image"
                      className="rounded-md"
                    />
                  ) : (
                    <SkeletonCard />
                  ))}

                {message.role !== "user" && message.model === "bing" ? (
                  <BingMessageComponent message={message.content} />
                ) : (
                  <Markdown
                    className="whitespace-pre-wrap"
                    remarkPlugins={[remarkGfm]}
                  >
                    {message.content}
                  </Markdown>
                )}

                <div className="flex justify-start gap-3 mt-1 h-1"></div>
              </div>
            </div>
          );
        })}

      {!sticky && (
        <Button
          type="button"
          variant="outline"
          className={`absolute bottom-2 left-1/2 w-[32px] h-[32px] p-0`}
          aria-label="go to bottom"
          onClick={() => scrollToBottom()}
        >
          <ArrowDownIcon className="w-4 h-4" />
        </Button>
      )}
    </>
  );
};

export default ChatView;

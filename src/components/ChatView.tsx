import { ArrowDownIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { useScrollToBottom, useSticky } from "react-scroll-to-bottom";
import { useQueryClient } from "@tanstack/react-query";

import { capitalizeFirstLetter } from "@/lib/utils";

import BingMessageComponent from "@/components/BingMessageComponent";
import SkeletonCard from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import MarkdownRender from "@/components/MarkdownRender";
import ModelIcon from "@/components/ModelIcon";

import { Message } from "@/state/useMessageStore";
import useConversationStore from "@/state/useConversationStore";

const ChatView = () => {
  const scrollToBottom = useScrollToBottom();
  const [sticky] = useSticky();

  const { selectedConversationId } = useConversationStore();

  const queryClient = useQueryClient();
  const messages: Message[] =
    queryClient.getQueryData(["messages", selectedConversationId]) || [];

  const getModelName = (model: string) => {
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

  return (
    <>
      {messages &&
        messages.filter((message: Message) => message.role === "user").length >
          0 &&
        messages.map((message: Message, i: number) => {
          return (
            <div key={`message_${i}`} className="flex gap-2 px-4 py-2">
              <div
                className={`flex justify-center w-6 h-6 bg-slate-200 rounded-full overflow-hidden`}
              >
                {message.role === "user" && (
                  <UserCircleIcon className="w-6 h-6 text-white" />
                )}
                {message.role !== "user" && (
                  <ModelIcon model={message.model} size={24} />
                )}
              </div>

              <div className="flex flex-col gap-1 w-[calc(100%-32px)]">
                <div className="leading-6 text-gray-700 font-semibold select-none">
                  {message.role === "user"
                    ? capitalizeFirstLetter(message.role)
                    : getModelName(message.model as string)}
                </div>
                {message.model?.includes("dall") &&
                  (message.imageUrl1 ? (
                    <img
                      src={message.imageUrl1}
                      alt="dall-e3_image"
                      className="rounded-md"
                    />
                  ) : (
                    <SkeletonCard />
                  ))}

                {message.role !== "user" && message.model === "bing" ? (
                  <BingMessageComponent message={message.content} />
                ) : (
                  <MarkdownRender mdString={message.content} />
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

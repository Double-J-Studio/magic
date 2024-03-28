import { useEffect } from "react";

import { ArrowDownIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { useScrollToBottom, useSticky } from "react-scroll-to-bottom";
import { useQueryClient } from "@tanstack/react-query";

import { capitalizeFirstLetter } from "@/lib/utils";
import { readImage } from "@/utils/tauri/file";

import BingMessageComponent from "@/components/BingMessageComponent";
import SkeletonCard from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import MarkdownRender from "@/components/MarkdownRender";

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

  useEffect(() => {
    async function loadImages() {
      const filtered = messages?.filter(
        (message) => message.imageUrls && !message.imageBlobUrl
      ) as Message[];
      if (filtered.length > 0) {
        const blobUrlByImagePath: Record<string, string> = {};
        await Promise.all(
          filtered.map(async (message) => {
            const image = await readImage(message.imageUrls!);
            const blob = new Blob([image]);
            const blobUrl = URL.createObjectURL(blob);
            blobUrlByImagePath[message.imageUrls!] = blobUrl;
          })
        );

        const clone: Message[] = JSON.parse(JSON.stringify(messages));
        Object.keys(blobUrlByImagePath).forEach((imagePath) => {
          const found = clone.find(
            (message) => message.imageUrls === imagePath
          );
          if (found) {
            found.imageBlobUrl = blobUrlByImagePath[imagePath];
          }
        });

        queryClient.setQueryData(["messages", selectedConversationId], clone);
      }
    }

    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <>
      {messages &&
        messages.filter((message: Message) => message.role === "user").length >
          0 &&
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
                    : getModelName(message.model as string)}
                </div>
                {message.model?.includes("dall") &&
                  (!message.isLoading && message.imageBlobUrl ? (
                    <img
                      src={message.imageBlobUrl}
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

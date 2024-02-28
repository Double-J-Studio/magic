import { useScrollToBottom, useSticky } from "react-scroll-to-bottom";
import { ArrowDownIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import BingMessageComponent from "@/components/BingMessageComponent";
import { capitalizeFirstLetter } from "@/lib/utils";
import useMessageStore from "@/state/useMessageStore";
import useSelectedModelStore from "@/state/useSelectedModelStore";

const ChatView = () => {
  const scrollToBottom = useScrollToBottom();
  const [sticky] = useSticky();

  const { messages } = useMessageStore();

  const changeModelName = (model: string) => {
    if (model.includes("gpt") || model.includes("dall")) {
      return "ChatGPT";
    }

    return capitalizeFirstLetter(model);
  };

  return (
    <>
      {messages.filter((message: any) => message.role === "assistant").length >
        0 &&
        messages.map((message: any, index: number) => {
          return (
            <div key={`message_${index}`} className="flex gap-2 px-4 py-2">
              <div
                className={`flex justify-center w-6 h-6 ${
                  message.role === "user" ? "bg-slate-200" : "bg-green-500"
                } rounded-full overflow-hidden`}
              >
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>

              <div className="flex flex-col gap-1 w-[calc(100%-32px)]">
                <div className="leading-6">
                  {message.role === "user"
                    ? capitalizeFirstLetter(message.role)
                    : changeModelName(message.model)}
                </div>
                {message.type && message.type === "image" && (
                  <img
                    src={message.imageUrls}
                    alt="dall-e3_image"
                    className="rounded-md"
                  />
                )}
                {message.model === "bing" ? (
                  <BingMessageComponent message={message.content} />
                ) : (
                  <Markdown
                    className="whitespace-pre-wrap"
                    remarkPlugins={[remarkGfm]}
                  >
                    {message.content}
                  </Markdown>
                )}

                <div className="flex justify-start gap-3 mt-1 h-3"></div>
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

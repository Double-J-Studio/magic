import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createChatCompletionStream, createImage } from "@/utils/openai";
import { kv } from "@/utils/tauri/kv";
import useMessageStore from "@/state/useMessageStore";
import useSelectedModelStore from "@/state/useSelectedModelStore";
import { readImage } from "@/utils/tauri/file";
import { db } from "@/utils/tauri/db";

const ChatInput = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, getValues, setValue, watch, reset } = useForm(
    {
      defaultValues: {
        message: "",
      },
    }
  );
  const { ref, ...registerMessageRes } = register("message");
  const { messages, setMessage, setAnswer, setImageAnswer } = useMessageStore();
  const { model } = useSelectedModelStore();

  const [apiKey, setApiKey] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    kv.get<string>("api_key").then((apiKey) => {
      if (apiKey) {
        setApiKey(apiKey);
      }
    });
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();

      const textarea = textareaRef.current as HTMLTextAreaElement;
      setValue("message", getValues("message") + "\n");

      textarea.style.setProperty("height", "auto");
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      handleMessageSend();
    }
  };

  const handleFormSubmit = (data: { message: string }) => {
    if (!apiKey) {
      alert("API key is not set. Please set the API key first.");
      navigate("/api-key-setting");
      return;
    }

    setMessage({ role: "user", content: data.message });
    setMessage({ role: "assistant", content: "" });
    // db.conversation.message.insert({
    //   model: model,
    //   imageUrls: "",
    //   content: data.message,
    //   role: "user",
    //   conversationId: 1,
    // });

    if (model === "dall-e-3") {
      createImage({
        apiKey: apiKey,
        model: model,
        prompt: data.message,
        size: "1024x1024",
      }).then((res: any) => {
        readImage(res).then((data) => {
          const blob = new Blob([data]);
          setImageAnswer(URL.createObjectURL(blob));
          // db.conversation.message.insert({
          //   model: model,
          //   imageUrls: URL.createObjectURL(blob),
          //   content: "",
          //   role: "",
          //   conversationId: 1,
          // });
        });
      });
    } else {
      createChatCompletionStream({
        apiKey: apiKey,
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a helpful AI. 답변은 한글로 줘.",
          },
          ...messages,
          {
            role: "user",
            content: data.message,
          },
        ],
        onMessage: (message) => {
          setAnswer(message);
        },
        onError: (error) => {
          console.error("error", error);
          alert(error);
        },
      }).then((_) => {
        // db.conversation.message.insert({
        //   model: model,
        //   imageUrls: "",
        //   content: messages[messages.length - 1].content,
        //   role: "assistant",
        //   conversationId: 1,
        // });
      });
    }

    reset({ message: "" });
  };

  const handleMessageSend = handleSubmit(handleFormSubmit, (e) =>
    console.log(e)
  );

  return (
    <div className="flex items-center justify-center w-full">
      <form
        className="relative grid gap-2 w-[60%]"
        onSubmit={handleMessageSend}
      >
        <TextareaAutosize
          minRows={1}
          maxRows={10}
          placeholder="Type your message here."
          className="p-2 pr-12 leading-8 border-2 rounded-2xl border-gray-300 resize-none outline-none overflow-hidden"
          ref={(_ref) => {
            textareaRef.current = _ref;
            ref(_ref);
          }}
          onKeyDown={handleKeyDown}
          {...registerMessageRes}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                aria-label="Send message"
                className={`absolute top-2/4 right-3 translate-y-[-50%] w-[32px] h-[32px] p-0 ${
                  watch("message").length === 0
                    ? "bg-gray-200 pointer-events-none"
                    : ""
                }`}
              >
                <PaperAirplaneIcon className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
    </div>
  );
};

export default ChatInput;

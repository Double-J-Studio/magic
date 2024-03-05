import { KeyboardEvent, useEffect, useRef } from "react";

import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

import { checkApiKeys } from "@/utils/api-key-check";
import { search } from "@/utils/bing";
import { createGroqChatCompletionStream } from "@/utils/groq";
import { createChatCompletionStream, createImage } from "@/utils/openai";
import { db } from "@/utils/tauri/db";
import { readImage } from "@/utils/tauri/file";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import useSelectedModelStore from "@/state/useSelectedModelStore";
import useMessageStore from "@/state/useMessageStore";
import useConversationStore from "@/state/useConversationStore";
import useApiKeyStore from "@/state/useApiKeyStore";

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
  const { messages, setMessage, setAnswer, setImageAnswer, setImageLoading } =
    useMessageStore();
  const { model } = useSelectedModelStore();
  const { apiKeys, setApiKeys } = useApiKeyStore();
  const { conversations } = useConversationStore();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    checkApiKeys(setApiKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const openaiApiKey = apiKeys?.filter(
      (apiKey) => apiKey.service === "openai"
    )[0].key;
    const bingApiKey = apiKeys?.filter((apiKey) => apiKey.service === "bing")[0]
      .key;

    if (model.includes("gpt") || model.includes("dall")) {
      if (openaiApiKey?.length < 1) {
        alert("OpenAI API key is not set. Please set the API key first.");
        navigate("/api-key-setting");
        return;
      }
    } else if (model.includes("bing")) {
      if (bingApiKey?.length < 1) {
        alert("Bing API key is not set. Please set the API key first.");
        navigate("/api-key-setting");
        return;
      }
    }

    if (conversations.length < 1) {
      db.conversation.insert(data.message.substring(0, 15));
    }

    setMessage({ role: "user", content: data.message });
    setMessage({ role: "assistant", content: "", model: model });
    db.conversation.message.insert({
      model: model,
      imageUrls: "",
      content: data.message,
      role: "user",
      conversationId: 1,
    });

    if (model.includes("llama2") || model.includes("mixtral")) {
      createGroqChatCompletionStream({
        apiKey: apiKeys[2].key,
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a helpful AI. 답변은 한글로 줘.",
          },
          ...messages.map((message) => {
            return { role: message.role, content: message.content };
          }),
          {
            role: "user",
            content: data.message,
          },
        ],
        onMessage: (message) => {
          setAnswer({ message: message, model: model });
        },
        onError: (error) => {
          console.error("error", error);
          alert(error);
        },
      });
    }

    if (model === "bing") {
      search({
        query: data.message,
        apiKey: apiKeys[1].key,
      }).then((res) => {
        const keysToExtract = ["id", "name", "snippet", "url", "datePublished"];
        const extractedList = res.webPages.value.map((page) => {
          return Object.fromEntries(
            Object.entries(page).filter(([key]) => keysToExtract.includes(key))
          );
        });

        setAnswer({ message: JSON.stringify(extractedList), model: model });
      });
    }

    if (model === "dall-e-3") {
      setImageLoading(true);
      createImage({
        apiKey: apiKeys[0].key,
        model: model,
        prompt: data.message,
        size: "1024x1024",
      }).then((res: any) => {
        readImage(res).then((data) => {
          const blob = new Blob([data]);
          setImageAnswer(URL.createObjectURL(blob));
          setImageLoading(false);
          db.conversation.message.insert({
            model: model,
            imageUrls: URL.createObjectURL(blob),
            content: "",
            role: "",
            conversationId: 1,
          });
        });
      });
    }

    if (model.includes("gpt")) {
      createChatCompletionStream({
        apiKey: apiKeys[0].key,
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a helpful AI. 답변은 한글로 줘.",
          },
          ...messages.map((message) => {
            return { role: message.role, content: message.content };
          }),
          {
            role: "user",
            content: data.message,
          },
        ],
        onMessage: (message) => {
          setAnswer({ message: message, model: model });
        },
        onError: (error) => {
          console.error("error", error);
          alert(error);
        },
      }).then((_) => {
        db.conversation.message.insert({
          model: model,
          imageUrls: "",
          content: messages[messages.length - 1].content,
          role: "assistant",
          conversationId: 1,
        });
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

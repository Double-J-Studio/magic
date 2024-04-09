import { KeyboardEvent, useEffect, useRef } from "react";

import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useQueryClient } from "@tanstack/react-query";

import { checkApiKeys } from "@/utils/api-key-check";
import { db } from "@/utils/tauri/db";
import { useGetConversations } from "@/hooks/db/useGetConversations";
import { geminiChat, gptChat, gptImageChat, groqChat } from "@/utils/chat";
import { useGetImages } from "@/hooks/db/useGetImages";

import { Button } from "@/components/ui/button";
import Tooltip from "@/components/Tooltip";

import useSelectedModelStore from "@/state/useSelectedModelStore";
import { Message } from "@/state/useMessageStore";
import useConversationStore from "@/state/useConversationStore";
import useApiKeyStore from "@/state/useApiKeyStore";
import useAlertStore from "@/state/useAlertStore";

import { MODELS, ROUTES } from "@/constant";

const ChatInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { register, handleSubmit, getValues, setValue, watch, reset } = useForm(
    {
      defaultValues: {
        message: "",
      },
    }
  );
  const { ref, ...registerMessageRes } = register("message", {
    required: "Requirement",
  });

  const { model } = useSelectedModelStore();
  const { setApiKeys } = useApiKeyStore();
  const { selectedConversationId, setLastInsertId, setSelectedConversationId } =
    useConversationStore();
  const { open: alertOpen, setInformation } = useAlertStore();

  const openaiApiKey = useApiKeyStore((state) => state.getApiKey("openai"));
  const groqApiKey = useApiKeyStore((state) => state.getApiKey("groq"));
  const geminiApiKey = useApiKeyStore((state) => state.getApiKey("gemini"));
  const geminiAI = new GoogleGenerativeAI(geminiApiKey);

  const IS_GPT_MODEL = model === MODELS["GPT-3.5"] || model === MODELS["GPT-4"];
  const IS_DALLE_MODEL = model === MODELS["DALL-E-3"];
  const IS_OPENAI_MODEL = IS_GPT_MODEL || IS_DALLE_MODEL;
  const IS_GROQ_MODEL = model === MODELS.LLAMA2 || model === MODELS.MIXTRAL;
  const IS_GEMINI_MODEL = model === MODELS.GEMINI;

  const queryClient = useQueryClient();
  const { refetch } = useGetConversations();
  const { refetch: refetchImages } = useGetImages();

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

  function setAlertInformation({
    description,
    service,
  }: {
    description?: string;
    service?: string;
  }) {
    if (description) {
      setInformation({ description: description });
    }

    if (service) {
      setInformation({
        pathname: ROUTES.API_KEY_SETTING,
        description: `${service} API key is not set. Please set the API key first.`,
      });
    }

    alertOpen();
  }

  const handleFormSubmit = async (data: { message: string }) => {
    if (IS_OPENAI_MODEL) {
      if (openaiApiKey?.length < 1) {
        setAlertInformation({ service: "OpenAI" });
        return;
      }
    } else if (IS_GROQ_MODEL) {
      if (groqApiKey?.length < 1) {
        setAlertInformation({ service: "Groq" });
        return;
      }
    } else if (IS_GEMINI_MODEL) {
      if (geminiApiKey?.length < 1) {
        setAlertInformation({ service: "Gemini" });
        return;
      }
    }

    reset({ message: "" });

    let conversationId = selectedConversationId;
    if (selectedConversationId === 0) {
      const { lastInsertId } = await db.conversation.insert(data.message);
      conversationId = lastInsertId;
      setLastInsertId(lastInsertId);
      refetch();
    }

    const currentData =
      queryClient.getQueryData(["messages", conversationId]) || [];
    const clone: Message[] = JSON.parse(JSON.stringify(currentData));
    clone.push({
      role: "user",
      content: data.message,
      conversationId: conversationId,
    });
    clone.push({ role: "assistant", content: "", model: model });
    queryClient.setQueryData(["messages", conversationId], clone);

    await db.conversation.message.insert({
      content: data.message,
      role: "user",
      conversationId: conversationId,
    });

    if (conversationId > 0) {
      setSelectedConversationId(conversationId);
    }

    if (IS_GROQ_MODEL) {
      groqChat({
        apiKey: groqApiKey,
        model: model,
        messages: clone,
        message: data.message,
        conversationId: conversationId,
        setData: (message: string) => {
          queryClient.setQueryData(
            ["messages", conversationId],
            (prev: Message[]) => {
              const clone = JSON.parse(JSON.stringify(prev));
              clone[clone.length - 1].model = model;
              clone[clone.length - 1].content += message;

              return clone;
            }
          );
        },
        setAlertInformation: setAlertInformation,
      });
    }

    if (IS_DALLE_MODEL) {
      clone[clone.length - 1].type = "image";
      clone[clone.length - 1].isLoading = true;

      await gptImageChat({
        apiKey: openaiApiKey,
        model: model,
        message: data.message,
        conversationId: conversationId,
        setData: (res: any) => {
          queryClient.setQueryData(
            ["messages", conversationId],
            (prev: Message[]) => {
              const clone = JSON.parse(JSON.stringify(prev));
              clone[clone.length - 1].model = model;
              clone[clone.length - 1].imageUrl1 = res;
              clone[clone.length - 1].isLoading = false;

              return clone;
            }
          );
        },
        setAlertInformation: setAlertInformation,
      });
      await refetchImages();
    }

    if (IS_GPT_MODEL) {
      gptChat({
        apiKey: openaiApiKey,
        model: model,
        messages: clone,
        message: data.message,
        conversationId: conversationId,
        setData: (message: string) => {
          queryClient.setQueryData(
            ["messages", conversationId],
            (prev: Message[]) => {
              const clone = JSON.parse(JSON.stringify(prev));
              clone[clone.length - 1].model = model;
              clone[clone.length - 1].content += message;

              return clone;
            }
          );
        },
        setAlertInformation: setAlertInformation,
      });
    }

    if (IS_GEMINI_MODEL) {
      const geminiModel = geminiAI.getGenerativeModel({ model: model });
      geminiChat({
        geminiModel: geminiModel,
        model: model,
        message: data.message,
        conversationId: conversationId,
        setData: (text: string) => {
          queryClient.setQueryData(
            ["messages", conversationId],
            (prev: Message[]) => {
              const clone = JSON.parse(JSON.stringify(prev));
              clone[clone.length - 1].model = model;
              clone[clone.length - 1].content += text;

              return clone;
            }
          );
        },
        setAlertInformation: setAlertInformation,
      });
    }
  };

  const handleMessageSend = handleSubmit(handleFormSubmit, (err) =>
    console.log(err)
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

        <Tooltip description="Send Message" side="top" sideOffset={10}>
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
        </Tooltip>
      </form>
    </div>
  );
};

export default ChatInput;

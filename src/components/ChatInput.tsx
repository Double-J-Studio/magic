import { KeyboardEvent, useEffect, useRef } from "react";

import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useQueryClient } from "@tanstack/react-query";

import { checkApiKeys, isCheckModel } from "@/utils/check";
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
        description: `${service} API key is not set. Please set the API key first.`,
      });
    }

    alertOpen();
  }

  const handleFormSubmit = async (data: { message: string }) => {
    if (isCheckModel("openai", model)) {
      if (openaiApiKey?.length < 1) {
        setAlertInformation({ service: "OpenAI" });
        return;
      }
    } else if (isCheckModel("groq", model)) {
      if (groqApiKey?.length < 1) {
        setAlertInformation({ service: "Groq" });
        return;
      }
    } else if (isCheckModel("gemini", model)) {
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

    if (isCheckModel("groq", model)) {
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

    if (isCheckModel("dalle", model)) {
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

    if (isCheckModel("gpt", model)) {
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

    if (isCheckModel("gemini", model)) {
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

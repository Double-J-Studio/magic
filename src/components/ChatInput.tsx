import { KeyboardEvent, useEffect, useRef } from "react";

import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useQueryClient } from "@tanstack/react-query";

import { checkApiKeys } from "@/utils/api-key-check";
import { search } from "@/utils/bing";
import { createGroqChatCompletionStream } from "@/utils/groq";
import { createChatCompletionStream, createImage } from "@/utils/openai";
import { db } from "@/utils/tauri/db";
import { readImage } from "@/utils/tauri/file";
import { useGetConversations } from "@/hooks/db/useGetConversations";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import useSelectedModelStore from "@/state/useSelectedModelStore";
import useMessageStore, { Message } from "@/state/useMessageStore";
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
    required: "필수",
  });

  const { popMessages } = useMessageStore();
  const { model } = useSelectedModelStore();
  const { apiKeys, setApiKeys } = useApiKeyStore();
  const { selectedConversationId, setLastInsertId, setSelectedConversationId } =
    useConversationStore();
  const { open: alertOpen, setInformation } = useAlertStore();

  const queryClient = useQueryClient();
  const { refetch } = useGetConversations();

  const openaiApiKey = apiKeys?.filter(
    (apiKey) => apiKey.service === "openai"
  )[0].key;
  const bingApiKey = apiKeys?.filter((apiKey) => apiKey.service === "bing")[0]
    .key;
  const groqApiKey = apiKeys?.filter((apiKey) => apiKey.service === "groq")[0]
    .key;
  const geminiApiKey = apiKeys?.filter(
    (apiKey) => apiKey.service === "gemini"
  )[0].key;
  const geminiAI = new GoogleGenerativeAI(geminiApiKey);

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
        pathname: "/setting/api-key-setting",
        description: `${service} API key is not set. Please set the API key first.`,
      });
    }

    alertOpen();
  }

  const handleFormSubmit = async (data: { message: string }) => {
    if (model.includes("gpt") || model.includes("dall")) {
      if (openaiApiKey?.length < 1) {
        setAlertInformation({ service: "OpenAI" });
        return;
      }
    } else if (model.includes("bing")) {
      if (bingApiKey?.length < 1) {
        setAlertInformation({ service: "Bing" });
        return;
      } else if (model.includes("llama2") || model.includes("mixtral")) {
        if (groqApiKey?.length < 1) {
          setAlertInformation({ service: "Groq" });
          return;
        }
      } else if (model.includes("gemini")) {
        if (geminiApiKey?.length < 1) {
          setAlertInformation({ service: "Gemini" });
          return;
        }
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

    if (model.includes("llama2") || model.includes("mixtral")) {
      let answer = "";
      await createGroqChatCompletionStream({
        apiKey: groqApiKey,
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a helpful AI. 답변은 한글로 줘.",
          },
          ...clone.map((message) => {
            return { role: message.role, content: message.content };
          }),
          {
            role: "user",
            content: data.message,
          },
        ],
        onMessage: (message) => {
          answer += message;
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
      })
        .then(async (_) => {
          await db.conversation.message.insert({
            model: model,
            imageUrls: "",
            content: answer,
            role: "assistant",
            conversationId: conversationId,
          });
        })
        .catch((error) => {
          console.error("error", error);
          popMessages();
          setAlertInformation({
            description: error,
          });
        });
    }

    if (model === "bing") {
      search({
        query: data.message,
        apiKey: bingApiKey,
      })
        .then(async (res) => {
          const keysToExtract = [
            "id",
            "name",
            "snippet",
            "url",
            "datePublished",
          ];
          const extractedList = res.webPages.value.map((page) => {
            return Object.fromEntries(
              Object.entries(page).filter(([key]) =>
                keysToExtract.includes(key)
              )
            );
          });

          queryClient.setQueryData(
            ["messages", conversationId],
            (prev: Message[]) => {
              const clone = JSON.parse(JSON.stringify(prev));
              clone[clone.length - 1].model = model;
              clone[clone.length - 1].content += JSON.stringify(extractedList);

              return clone;
            }
          );

          await db.conversation.message.insert({
            model: model,
            imageUrls: "",
            content: JSON.stringify(extractedList),
            role: "assistant",
            conversationId: conversationId,
          });
        })
        .catch((error) => {
          console.error("error", error);
          popMessages();
          setAlertInformation({
            description: error,
          });
        });
    }

    if (model === "dall-e-3") {
      clone[clone.length - 1].type = "image";
      clone[clone.length - 1].isLoading = true;

      createImage({
        apiKey: openaiApiKey,
        model: model,
        prompt: data.message,
        size: "1024x1024",
      })
        .then((res: any) => {
          readImage(res).then(async (data) => {
            queryClient.setQueryData(
              ["messages", conversationId],
              (prev: Message[]) => {
                const clone = JSON.parse(JSON.stringify(prev));
                clone[clone.length - 1].model = model;
                clone[clone.length - 1].imageUrls = res;
                clone[clone.length - 1].isLoading = false;

                return clone;
              }
            );

            await db.conversation.message.insert({
              model: model,
              imageUrls: res,
              content: "",
              role: "assistant",
              conversationId: conversationId,
            });
          });
        })
        .catch((error) => {
          console.error("error", error);
          popMessages();
          setAlertInformation({
            description: error,
          });
        });
    }

    if (model.includes("gpt")) {
      let answer = "";
      await createChatCompletionStream({
        apiKey: openaiApiKey,
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a helpful AI. 답변은 한글로 줘.",
          },
          ...clone.map((message) => {
            return { role: message.role, content: message.content };
          }),
          {
            role: "user",
            content: data.message,
          },
        ],
        onMessage: (message) => {
          answer += message;

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
      })
        .then(async (_) => {
          await db.conversation.message.insert({
            model: model,
            imageUrls: "",
            content: answer,
            role: "assistant",
            conversationId: conversationId,
          });
        })
        .catch((error) => {
          console.error("error", error);
          popMessages();
          setAlertInformation({
            description: error,
          });
        });
    }

    if (model.includes("gemini")) {
      const geminiModel = geminiAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `${data.message}. 답변은 한글로 줘.`;
      try {
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response?.text();

        queryClient.setQueryData(
          ["messages", conversationId],
          (prev: Message[]) => {
            const clone = JSON.parse(JSON.stringify(prev));
            clone[clone.length - 1].model = model;
            clone[clone.length - 1].content += text;

            return clone;
          }
        );

        await db.conversation.message.insert({
          model: model,
          content: text,
          role: "assistant",
          conversationId: conversationId,
        });
      } catch (error: any) {
        console.error("error", error);
        popMessages();
        setAlertInformation({
          description: error,
        });
      }
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

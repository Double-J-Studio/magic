import { GenerativeModel } from "@google/generative-ai";

import { createGroqChatCompletionStream } from "@/utils/groq";
import { db } from "@/utils/tauri/db";
import { search } from "@/utils/bing";
import { createChatCompletionStream, createImage } from "@/utils/openai";
import { ollama } from "@/utils/ollama";
import { claude } from "@/utils/claude";

import { Message } from "@/state/useMessageStore";

type SetAlertInformationType = ({
  description,
  service,
}: {
  description?: string;
  service?: string;
}) => void;

interface GroqChat {
  apiKey: string;
  model: string;
  messages: Message[];
  message: string;
  conversationId: number;
  setData: (message: string) => void;
  setAlertInformation: SetAlertInformationType;
}

export async function groqChat({
  apiKey,
  model,
  messages,
  message,
  conversationId,
  setData,
  setAlertInformation,
}: GroqChat) {
  let answer = "";
  await createGroqChatCompletionStream({
    apiKey: apiKey,
    model: model,
    messages: [
      {
        role: "system",
        content: getSelectedAssistant(),
      },
      ...messages.map((message: Message) => {
        return { role: message.role, content: message.content };
      }),
      {
        role: "user",
        content: message,
      },
    ],
    onMessage: (message) => {
      answer += message;
      setData(message);
    },
  })
    .then(async (_) => {
      await db.conversation.message.insert({
        model: model,
        content: answer,
        role: "assistant",
        conversationId: conversationId,
      });
    })
    .catch((error) => {
      console.error("error", error);
      setAlertInformation({
        description: error,
      });
    });
}

interface BingChat {
  apiKey: string;
  model: string;
  message: string;
  conversationId: number;
  setData: (
    extractedList: {
      [k: string]: any;
    }[]
  ) => void;
  setAlertInformation: SetAlertInformationType;
}

export async function bingChat({
  apiKey,
  model,
  message,
  conversationId,
  setData,
  setAlertInformation,
}: BingChat) {
  search({
    query: message,
    apiKey: apiKey,
  })
    .then(async (res) => {
      const keysToExtract = ["id", "name", "snippet", "url", "datePublished"];
      const extractedList = res.webPages.value.map((page) => {
        return Object.fromEntries(
          Object.entries(page).filter(([key]) => keysToExtract.includes(key))
        );
      });

      setData(extractedList);

      await db.conversation.message.insert({
        model: model,
        content: JSON.stringify(extractedList),
        role: "assistant",
        conversationId: conversationId,
      });
    })
    .catch((error) => {
      console.error("error", error);
      setAlertInformation({
        description: error,
      });
    });
}

interface GptImageChat {
  apiKey: string;
  model: string;
  message: string;
  conversationId: number;
  setData: (message: string) => void;
  setAlertInformation: SetAlertInformationType;
}

export async function gptImageChat({
  apiKey,
  model,
  message,
  conversationId,
  setData,
  setAlertInformation,
}: GptImageChat) {
  try {
    const imageUrl = await createImage({
      apiKey: apiKey,
      model: model,
      prompt: message,
      size: "1024x1024",
    });
    setData(imageUrl);

    const { lastInsertId } = await db.conversation.message.insert({
      model: model,
      imageUrl1: imageUrl,
      content: "",
      role: "assistant",
      conversationId: conversationId,
    });
    await db.image.insert({ url: imageUrl, messageId: lastInsertId });
  } catch (error) {
    console.error("error", error);
    setAlertInformation({
      description: (error as Error)?.message || "something`s wrong",
    });
  }
}

interface GptChat {
  apiKey: string;
  model: string;
  messages: Message[];
  message: string;
  conversationId: number;
  setData: (message: string) => void;
  setAlertInformation: SetAlertInformationType;
}

export async function gptChat({
  apiKey,
  model,
  messages,
  message,
  conversationId,
  setData,
  setAlertInformation,
}: GptChat) {
  let answer = "";
  await createChatCompletionStream({
    apiKey: apiKey,
    model: model,
    messages: [
      {
        role: "system",
        content: getSelectedAssistant(),
      },
      ...messages.map((message: Message) => {
        return { role: message.role, content: message.content };
      }),
      {
        role: "user",
        content: message,
      },
    ],
    onMessage: (message) => {
      answer += message;

      setData(message);
    },
  })
    .then(async (_) => {
      await db.conversation.message.insert({
        model: model,
        content: answer,
        role: "assistant",
        conversationId: conversationId,
      });
    })
    .catch((error) => {
      console.error("error", error);
      setAlertInformation({
        description: error,
      });
    });
}

interface GeminiChat {
  geminiModel: GenerativeModel;
  model: string;
  message: string;
  conversationId: number;
  setData: (text: string) => void;
  setAlertInformation: SetAlertInformationType;
}

export async function geminiChat({
  geminiModel,
  model,
  message,
  conversationId,
  setData,
  setAlertInformation,
}: GeminiChat) {
  const prompt = `${message}. ${getSelectedAssistant()}`;
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response?.text();

    setData(text);

    await db.conversation.message.insert({
      model: model,
      content: text,
      role: "assistant",
      conversationId: conversationId,
    });
  } catch (error: any) {
    console.error("error", error);
    setAlertInformation({
      description: error,
    });
  }
}

interface OllamaChat {
  model: string;
  messages: Message[];
  message: string;
  conversationId: number;
  setData: (message: string) => void;
  setAlertInformation: SetAlertInformationType;
}

export async function ollamaChat({
  model,
  messages,
  message,
  conversationId,
  setData,
  setAlertInformation,
}: OllamaChat) {
  let answer = "";
  await ollama
    .chatStream({
      model: model,
      messages: [
        {
          role: "system",
          content: getSelectedAssistant(),
        },
        ...messages.map((message: Message) => {
          return { role: message.role, content: message.content };
        }),
        {
          role: "user",
          content: message,
        },
      ],
      onMessage: (message) => {
        answer += message;
        setData(message);
      },
    })
    .then(async (_) => {
      await db.conversation.message.insert({
        model: model,
        content: answer,
        role: "assistant",
        conversationId: conversationId,
      });
    })
    .catch((error) => {
      console.error("error", error);
      setAlertInformation({
        description: error,
      });
    });
}

interface ClaudeChat {
  apiKey: string;
  model: string;
  message: string;
  conversationId: number;
  setData: (message: string) => void;
  setAlertInformation: SetAlertInformationType;
}

export async function claudeChat({
  apiKey,
  model,
  message,
  conversationId,
  setData,
  setAlertInformation,
}: ClaudeChat) {
  let answer = "";
  await claude
    .createMessageStream({
      apiKey: apiKey,
      model: model,
      system: getSelectedAssistant(),
      messages: [{ role: "user", content: message }],
      onMessage: (message) => {
        answer += message;
        setData(message);
      },
    })
    .then(async (_) => {
      await db.conversation.message.insert({
        model: model,
        content: answer,
        role: "assistant",
        conversationId: conversationId,
      });
    })
    .catch((error) => {
      console.error("error", error);
      setAlertInformation({
        description: error,
      });
    });
}

function getSelectedAssistant() {
  const selectedAssistant = localStorage.getItem("selectedAssistant");
  if (selectedAssistant) {
    const result = JSON.parse(selectedAssistant);
    return result.state.assistant.instructions;
  }

  return "You are a helpful AI. Please answer in the language I asked.";
}

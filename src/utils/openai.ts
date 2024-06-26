import { invoke } from "@tauri-apps/api/tauri";

import { safeParseJSON } from "@/utils/json";

interface CreateChatCompletionStreamParams {
  apiKey: string;
  model: string;
  messages: { role: string; content: string }[];
  onMessage: (message: string) => void;
}

export async function createChatCompletionStream({
  apiKey,
  onMessage,
  ...body
}: CreateChatCompletionStreamParams) {
  const res = await fetch(
    `https://api.openai.com/v1/chat/completions`,

    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        max_tokens: 2048,
        stream: true,
      }),
    }
  );

  const reader = (res.body as any)?.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = (await reader?.read()) as any;
    if (done) break;

    const decoded = decoder.decode(value);
    const data = decoded.split(/\n\n/);
    for (const d of data) {
      const parsed = safeParseJSON(d.replace("data: ", ""));
      if (parsed?.error) {
        throw parsed?.error?.message;
      }

      onMessage(parsed?.choices?.[0]?.delta?.content || "");
    }
  }
}

interface CreateImageParams {
  apiKey: string;
  model: string;
  prompt: string;
  size: "1024x1024" | "1792x1024" | "1024x1792";
}

export interface CreateImageResponse {
  created: number; // e.g. 1589478378
  data: {
    url: string; // "https://..."
  }[];
}

export async function createImage({ apiKey, ...body }: CreateImageParams) {
  const res = await fetch(
    `https://api.openai.com/v1/images/generations`,

    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
      }),
    }
  );
  if (!res.ok) {
    throw new Error(
      `fetch failed status ${res.status} res ${await res.text()}`
    );
  }

  const imageRes = (await res.json()) as CreateImageResponse;
  const imageUrl = imageRes.data?.[0].url;
  if (!imageUrl) {
    throw new Error("imageUrl not exists");
  }

  const localImageUrl = await invoke("write_image", { imageUrl });

  return localImageUrl as string;
}

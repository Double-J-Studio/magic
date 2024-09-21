import { safeParseJSON } from "@/utils/json";

interface CreateMessageStreamParams {
  apiKey: string;
  model: string;
  system: string;
  messages: { role: string; content: string }[];
  onMessage: (message: string) => void;
}

export async function createMessageStream({
  apiKey,
  system,
  onMessage,
  ...body
}: CreateMessageStreamParams) {
  const res = await fetch(`https://api.anthropic.com/v1/messages`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
      max_tokens: 2048,
      stream: true,
      system: system,
    }),
  });
  const reader = (res.body as any)?.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = (await reader?.read()) as any;
    if (done) break;

    const decoded = decoder.decode(value);
    const data = decoded.split(/\n/);
    for (const d of data) {
      // 예) event: message_delta/event: message_stop/event: content_block_delta
      if (d.startsWith("event:")) {
        continue;
      }

      const parsed = safeParseJSON(d.replace("data: ", ""));
      if (parsed?.error) {
        throw parsed?.error?.message;
      }

      onMessage(parsed?.delta?.text || "");
    }
  }
}

export const claude = {
  createMessageStream,
};

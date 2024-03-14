interface CreateGroqChatCompletionStreamParams {
  apiKey: string;
  model: string;
  messages: { role: string; content: string }[];
  onMessage: (message: string) => void;
}

export async function createGroqChatCompletionStream({
  apiKey,
  onMessage,
  ...body
}: CreateGroqChatCompletionStreamParams) {
  const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
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
  });

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

function safeParseJSON(s: string) {
  try {
    return JSON.parse(s || "{}");
  } catch (error) {
    console.error("error", error);
    return {};
  }
}

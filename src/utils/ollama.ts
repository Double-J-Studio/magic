import { safeParseJSON } from "@/utils/json";

// TODO: 사용자의 Ollama 환경에 맞게 host:port 변경 가능하도록 수정
const OLLAMA_HOST = "http://localhost:11434";

export const ollama = {
  generate,
  chat,
  chatStream,
};

export async function generate(req: GenerateRequest) {
  const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: "POST",
    body: JSON.stringify({ ...req, stream: false }),
  });
  const data: GenerateResponse = await res.json();

  return data;
}

async function chat(req: ChatRequest) {
  const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: "POST",
    body: JSON.stringify({ ...req, stream: false }),
  });
  const data: ChatResponse = await res.json();

  return data;
}

async function chatStream({
  onMessage,
  ...req
}: { onMessage: (message: string) => void } & ChatRequest) {
  const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: "POST",
    body: JSON.stringify({ ...req, stream: true }),
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

      onMessage(parsed?.message.content);
    }
  }
}

export interface GenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  template?: string;
  context?: number[];
  stream?: boolean;
  raw?: boolean;
  format?: string;
  images?: Uint8Array[] | string[];
  keep_alive?: string | number;

  options?: Partial<Options>;
}

export interface GenerateResponse {
  model: string;
  created_at: Date;
  response: string;
  done: boolean;
  context: number[];
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

export interface ChatRequest {
  model: string;
  messages?: Message[];
  format?: string;
  keep_alive?: string | number;

  options?: Partial<Options>;
}

export interface ChatResponse {
  model: string;
  created_at: Date;
  message: Message;
  done: boolean;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

export interface Message {
  role: string;
  content: string;
  images?: Uint8Array[] | string[];
}

export interface Options {
  numa: boolean;
  num_ctx: number;
  num_batch: number;
  main_gpu: number;
  low_vram: boolean;
  f16_kv: boolean;
  logits_all: boolean;
  vocab_only: boolean;
  use_mmap: boolean;
  use_mlock: boolean;
  embedding_only: boolean;
  num_thread: number;

  // Runtime options
  num_keep: number;
  seed: number;
  num_predict: number;
  top_k: number;
  top_p: number;
  tfs_z: number;
  typical_p: number;
  repeat_last_n: number;
  temperature: number;
  repeat_penalty: number;
  presence_penalty: number;
  frequency_penalty: number;
  mirostat: number;
  mirostat_tau: number;
  mirostat_eta: number;
  penalize_newline: boolean;
  stop: string[];
}

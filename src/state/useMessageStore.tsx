import { create } from "zustand";

export interface Message {
  type?: string;
  model?: string;
  role: string;
  content: string;
  imageUrl1?: string;
  isLoading?: boolean;
  id?: number;
  conversationId?: number;
  createdAt?: string;
}

interface UseMessageStoreProps {
  messages: Message[];
  setMessage: (message: Message) => void;
  setAnswer: ({ message, model }: { message: string; model: string }) => void;
  setImageAnswer: (image: string) => void;
  setImageLoading: (isLoading: boolean) => void;
  setMessages: (messages: Message[]) => void;
  initMessages: () => void;
  popMessages: () => void;
}

const useMessageStore = create<UseMessageStoreProps>()((set) => ({
  messages: [],

  setMessage: (message) => {
    set((state) => ({ ...state, messages: [...state.messages, message] }));
  },
  setAnswer: ({ message, model }) => {
    set((state) => {
      const clone = JSON.parse(JSON.stringify(state.messages));

      clone[clone.length - 1].model = model;
      clone[clone.length - 1].content += message;

      return { ...state, messages: clone };
    });
  },
  setImageAnswer: (image) => {
    set((state) => {
      const clone = JSON.parse(JSON.stringify(state.messages));
      clone[clone.length - 1].model = "dall-e-3";
      clone[clone.length - 1].imageUrl1 = image;

      return { ...state, messages: clone };
    });
  },
  setImageLoading: (isLoading) => {
    set((state) => {
      const clone = JSON.parse(JSON.stringify(state.messages));
      clone[clone.length - 1].type = "image";
      clone[clone.length - 1].isLoading = isLoading;

      return { ...state, messages: clone };
    });
  },
  setMessages: (messages) => {
    set((state) => ({ ...state, messages: messages }));
  },
  initMessages: () => {
    set((state) => ({ ...state, messages: [] }));
  },
  popMessages: () => {
    set((state) => {
      const clone = JSON.parse(JSON.stringify(state.messages));
      clone.pop();

      return { ...state, messages: clone };
    });
  },
}));

export default useMessageStore;

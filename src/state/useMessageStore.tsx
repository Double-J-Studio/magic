import { create } from "zustand";

export interface Message {
  type?: string;
  role: string;
  content: string;
}

interface UseMessageStoreProps {
  messages: Message[];
  setMessage: (message: Message) => void;
  setAnswer: (message: string) => void;
  setImageAnswer: (image: string) => void;
}

const useMessageStore = create<UseMessageStoreProps>()((set) => ({
  messages: [],

  setMessage: (message) => {
    set((state) => ({ ...state, messages: [...state.messages, message] }));
  },
  setAnswer: (message) => {
    set((state) => {
      const clone = JSON.parse(JSON.stringify(state.messages));
      clone[clone.length - 1].content += message;

      return { ...state, messages: clone };
    });
  },
  setImageAnswer: (image) => {
    set((state) => {
      const clone = JSON.parse(JSON.stringify(state.messages));
      clone[clone.length - 1].type = "image";
      clone[clone.length - 1].imageUrls = image;

      return { ...state, messages: clone };
    });
  },
}));

export default useMessageStore;

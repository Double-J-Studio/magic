import { create } from "zustand";

export interface Conversation {
  id?: number;
  name?: string;
  createdAt?: string; // YYYY-MM-DD HH:mm:ss
  updatedAt?: string; // YYYY-MM-DD HH:mm:ss
}

interface UseConversationStoreProps {
  conversations: Conversation[];
  selectedConversationId: number;
  setConversations: (conversations: Conversation[]) => void;
  setSelectedConversationId: (conversationId: number) => void;
}

const useConversationStore = create<UseConversationStoreProps>()((set) => ({
  conversations: [],
  selectedConversationId: 0,

  setConversations: (conversations) => {
    set((state) => ({
      ...state,
      conversations: conversations,
    }));
  },
  setSelectedConversationId: (conversationId) => {
    set((state) => ({
      ...state,
      selectedConversationId: conversationId,
    }));
  },
}));

export default useConversationStore;

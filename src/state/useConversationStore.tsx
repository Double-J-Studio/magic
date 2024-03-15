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
  lastInsertId: number;
  clickedDeleteButtonId: number;
  shouldRefetch: boolean;
  setConversations: (conversations: Conversation[]) => void;
  setSelectedConversationId: (conversationId: number) => void;
  initSelectedConversationId: () => void;
  setLastInsertId: (id: number) => void;
  setDeleteButtonId: (id: number) => void;
  refetch: () => void;
}

const useConversationStore = create<UseConversationStoreProps>()((set) => ({
  conversations: [],
  selectedConversationId: 0,
  lastInsertId: 0,
  clickedDeleteButtonId: 0,
  shouldRefetch: false,

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
  initSelectedConversationId: () => {
    set((state) => ({
      ...state,
      selectedConversationId: 0,
    }));
  },
  setLastInsertId: (id) => {
    set((state) => ({
      ...state,
      lastInsertId: id,
    }));
  },
  setDeleteButtonId: (id) => {
    set((state) => ({
      ...state,
      clickedDeleteButtonId: id,
    }));
  },
  refetch: () => {
    set((state) => ({
      ...state,
      shouldRefetch: !state.shouldRefetch,
    }));
  },
}));

export default useConversationStore;

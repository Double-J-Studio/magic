import { create } from "zustand";

interface Conversation {
  id?: number;
  name?: string;
  created_at?: string; // YYYY-MM-DD HH:mm:ss
  updated_at?: string; // YYYY-MM-DD HH:mm:ss
}

interface UseConversationStoreProps {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
}

const useConversationStore = create<UseConversationStoreProps>()((set) => ({
  conversations: [],

  setConversations: (conversations) => {
    set((state) => ({
      ...state,
      conversations: conversations,
    }));
  },
}));

export default useConversationStore;

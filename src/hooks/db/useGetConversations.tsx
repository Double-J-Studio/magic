import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { db } from "@/utils/tauri/db";

import { Conversation } from "@/state/useConversationStore";

export const useGetConversations = () => {
  const {
    data: conversations,
    isLoading,
    error,
    refetch,
  }: UseQueryResult<Conversation[], any> = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await db.conversation.list();
      return res;
    },
  });

  return { conversations, isLoading, error, refetch };
};

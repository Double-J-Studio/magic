import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { db } from "@/utils/tauri/db";

import { Message } from "@/state/useMessageStore";

export const useGetMessages = ({ id }: { id: number }) => {
  const {
    data: messages,
    isLoading,
    error,
  }: UseQueryResult<Message[], any> = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const res = await db.conversation.message.list(id);

      return res;
    },
    enabled: Boolean(id),
  });

  return { messages, isLoading, error };
};

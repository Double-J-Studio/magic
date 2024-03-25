import { useMutation, useQueryClient } from "@tanstack/react-query";

import { db } from "@/utils/tauri/db";

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => await db.conversation.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["messages"],
      });
    },
  });
};

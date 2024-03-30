import { useQuery } from "@tanstack/react-query";

import { db } from "@/utils/tauri/db";
import type { Image } from "@/utils/tauri/db";

export interface Images {
  [key: string]: { loading: boolean; blobUrl: string };
}

export const useGetImages = () => {
  const {
    data: images,
    isLoading,
    error,
    refetch,
  } = useQuery<Image[]>({
    queryKey: ["images"],
    queryFn: async () => {
      return await db.image.list();
    },
  });

  return { images, isLoading, error, refetch };
};

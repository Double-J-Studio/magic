import { useEffect } from "react";

import {
  UseQueryResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { readImage, readImages } from "@/utils/tauri/file";

export interface Images {
  [key: string]: { loading: boolean; blobUrl: string };
}

export const useGetImages = () => {
  const queryClient = useQueryClient();
  const {
    data: images,
    isLoading,
    error,
  }: UseQueryResult<Images, any> = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const res = await readImages();

      return res.reduce((imagesObj, img) => {
        imagesObj[img.path] = { loading: true, blobUrl: "" };

        return imagesObj;
      }, {} as Images);
    },
  });

  useEffect(() => {
    async function loadImages() {
      for (const imagePath of Object.keys(images || {})) {
        try {
          const res = await readImage(imagePath);

          const blob = new Blob([res], { type: "image/jpeg" });
          const blobUrl = URL.createObjectURL(blob);

          queryClient.setQueryData(["images"], (prev: Images) => ({
            ...prev,
            [imagePath]: {
              loading: false,
              blobUrl: blobUrl,
            },
          }));
        } catch (err) {
          console.error(err);
        }
      }
    }

    if (!isLoading && images && Object.keys(images).length > 0) {
      loadImages();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, isLoading]);

  return { images, isLoading, error };
};

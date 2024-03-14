import { useEffect } from "react";

import { readImage, readImages } from "@/utils/tauri/file";

import { Skeleton } from "@/components/ui/skeleton";

import useImageGalleryStore, { Images } from "@/state/useImageGalleryStore";

const ImageGalleryPage = () => {
  const { images, setImages } = useImageGalleryStore();

  useEffect(() => {
    async function uint8ArrayToBlobUrl() {
      const imgs = await readImages();
      const imagesObj: Images = {};

      imgs.map(async (img) => {
        imagesObj[img.path] = { loading: true, blobUrl: "" };
      });
      setImages(imagesObj);

      await Promise.allSettled(
        imgs.map(async (img) => {
          const res = await readImage(img.path);

          const blob = new Blob([res], { type: "image/jpeg" });
          const blobUrl = URL.createObjectURL(blob);

          imagesObj[img.path] = {
            loading: false,
            blobUrl: blobUrl,
          };
          setImages(imagesObj);
        })
      );
    }

    uint8ArrayToBlobUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full min-h-screen p-5">
      <ul className="grid grid-cols-4 gap-2">
        {images &&
          Object.keys(images).map((image, i) => {
            return (
              <li key={`${image}_${i}`}>
                {images[image].loading ? (
                  <Skeleton className="w-full min-w-[120px] h-full min-h-[120px] rounded-xl" />
                ) : (
                  <img
                    src={images[image].blobUrl}
                    alt=""
                    className="rounded-md"
                  />
                )}
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default ImageGalleryPage;

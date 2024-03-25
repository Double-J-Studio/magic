import { useGetImages } from "@/hooks/db/useGetImages";

import { Skeleton } from "@/components/ui/skeleton";

const ImageGalleryPage = () => {
  const { images } = useGetImages();

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

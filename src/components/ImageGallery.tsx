import { useGetImages } from "@/hooks/db/useGetImages";

import { Skeleton } from "@/components/ui/skeleton";

import EmptyImage from "@/assets/no-image-yet.png";

const ImageGallery = () => {
  const { images, isLoading } = useGetImages();
  const hasImages = images && images.length > 0;

  return (
    <div className="w-full h-full p-5">
      {hasImages || isLoading ? (
        <ul className="grid grid-cols-4 gap-2">
          {hasImages &&
            images.map((image) => (
              <li key={`image-gallery-${image.id}`}>
                <img src={image.url} alt="" className="rounded-md" />
              </li>
            ))}
          {isLoading && (
            <Skeleton className="w-full min-w-[120px] h-full min-h-[120px] rounded-xl" />
          )}
        </ul>
      ) : (
        <img src={EmptyImage} alt="empty" />
      )}
    </div>
  );
};

export default ImageGallery;

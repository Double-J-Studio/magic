import { Images } from "@/pages/SettingPage";

interface ImageGalleryProps {
  images?: Images;
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="w-full min-h-screen p-5">
      <ul className="grid grid-cols-4 gap-2">
        {images &&
          Object.keys(images).map((image, i) => {
            return (
              <li key={`${image}_${i}`}>
                <img
                  src={images[image].blobUrl}
                  alt=""
                  className="rounded-md"
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default ImageGallery;

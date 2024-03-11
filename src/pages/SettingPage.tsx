import { useEffect, useState } from "react";

import { checkApiKeys } from "@/utils/api-key-check";
import { readImage, readImages } from "@/utils/tauri/file";

import ApiKeySetting from "@/components/ApiKeySetting";
import ImageGallery from "@/components/ImageGallery";

import useApiKeyStore from "@/state/useApiKeyStore";
import useSettingMenuStore from "@/state/useSettingMenuStore";

export interface Images {
  [key: string]: { loading: boolean; blobUrl: string };
}

const SettingPage = () => {
  const [images, setImages] = useState<Images>();

  const { setApiKeys } = useApiKeyStore();
  const { selectedMenuItem } = useSettingMenuStore();

  useEffect(() => {
    checkApiKeys(setApiKeys);

    async function uint8ArrayToBlobUrl() {
      const imgs = await readImages();
      const imagesObj: Images = {};

      await Promise.allSettled(
        imgs.map(async (img) => {
          imagesObj[img.path] = { loading: true, blobUrl: "" };

          const res = await readImage(img.path);

          const blob = new Blob([res], { type: "image/jpeg" });
          const blobUrl = URL.createObjectURL(blob);

          imagesObj[img.path] = {
            loading: false,
            blobUrl: blobUrl,
          };
        })
      );

      setImages(imagesObj);
    }

    uint8ArrayToBlobUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {selectedMenuItem === "API Key Setting" && <ApiKeySetting />}
      {selectedMenuItem === "Image Gallery" && <ImageGallery images={images} />}
    </div>
  );
};

export default SettingPage;

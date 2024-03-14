import { useEffect } from "react";

import { checkApiKeys } from "@/utils/api-key-check";

import ApiKeySetting from "@/components/ApiKeySetting";
import ImageGallery from "@/components/ImageGallery";

import useApiKeyStore from "@/state/useApiKeyStore";
import useSettingMenuStore from "@/state/useSettingMenuStore";

const SettingPage = () => {
  const { setApiKeys } = useApiKeyStore();
  const { selectedMenuItem } = useSettingMenuStore();

  useEffect(() => {
    checkApiKeys(setApiKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {selectedMenuItem === "API Key Setting" && <ApiKeySetting />}
      {selectedMenuItem === "Image Gallery" && <ImageGallery />}
    </div>
  );
};

export default SettingPage;

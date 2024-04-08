import SettingsMenu from "@/components/SettingsMenu";
import ApiKeySetting from "@/components/ApiKeySetting";
import ImageGallery from "@/components/ImageGallery";

import useSettingMenuStore from "@/state/useSettingMenuStore";

const SettingsLayout = () => {
  const { selectedMenuItem } = useSettingMenuStore();

  return (
    <div className="flex min-w-full h-full">
      <SettingsMenu />

      <div className="w-full sm:max-w-[calc(100%-160px)] lg:max-w-[calc(100%-256px)]">
        {selectedMenuItem === "api-key-setting" && <ApiKeySetting />}
        {selectedMenuItem === "image-gallery" && <ImageGallery />}
        {selectedMenuItem === "user-information" && <></>}
      </div>
    </div>
  );
};

export default SettingsLayout;

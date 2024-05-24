import SettingsMenu from "@/components/SettingsMenu";
import ApiKeySetting from "@/components/ApiKeySetting";
import ImageGallery from "@/components/ImageGallery";
import Profile from "@/components/Profile";
import Ollama from "@/components/Ollama";

import useSettingsStore from "@/state/useSettingsStore";

const SettingsLayout = () => {
  const { selectedMenuItem } = useSettingsStore();

  return (
    <div className="flex min-w-full h-full">
      <SettingsMenu />

      <div className="w-full sm:max-w-[calc(100%-160px)] lg:max-w-[calc(100%-256px)]">
        {selectedMenuItem === "api-key-setting" && <ApiKeySetting />}
        {selectedMenuItem === "image-gallery" && <ImageGallery />}
        {selectedMenuItem === "profile" && <Profile />}
        {selectedMenuItem === "ollama" && <Ollama />}
      </div>
    </div>
  );
};

export default SettingsLayout;

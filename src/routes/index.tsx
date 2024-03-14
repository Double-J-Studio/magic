import { Route, Routes } from "react-router-dom";

import DefaultLayout from "@/components/layout/DefaultLayout";
import SettingLayout from "@/components/layout/SettingLayout";
import MainPage from "@/pages/MainPage";
import ApiKeySetting from "@/pages/ApiKeySettingPage";
import ImageGallery from "@/pages/ImageGalleryPage";
import PageNotFound from "@/pages/PageNotFound";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<MainPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>

      <Route path="/setting" element={<SettingLayout />}>
        <Route path="api-key-setting" element={<ApiKeySetting />} />
        <Route path="image-gallery" element={<ImageGallery />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default Router;

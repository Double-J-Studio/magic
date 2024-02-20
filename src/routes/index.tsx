import { Routes, Route } from "react-router-dom";

import ApiKeySettingPage from "@/pages/ApiKeySettingPage";
import PageNotFound from "@/pages/PageNotFound";
import MainPage from "@/pages/MainPage";
import DefaultLayout from "@/components/layout/DefaultLayout";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<MainPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>

      <Route path="api-key-setting" element={<ApiKeySettingPage />} />
    </Routes>
  );
};

export default Router;

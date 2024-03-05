import { Route, Routes } from "react-router-dom";

import DefaultLayout from "@/components/layout/DefaultLayout";
import ApiKeySettingPage from "@/pages/ApiKeySettingPage";
import MainPage from "@/pages/MainPage";
import PageNotFound from "@/pages/PageNotFound";


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

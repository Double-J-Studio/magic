import { Route, Routes } from "react-router-dom";

import DefaultLayout from "@/components/layout/DefaultLayout";
import SettingPage from "@/pages/SettingPage";
import MainPage from "@/pages/MainPage";
import PageNotFound from "@/pages/PageNotFound";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<MainPage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default Router;

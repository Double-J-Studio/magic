import { Route, Routes } from "react-router-dom";

import DefaultLayout from "@/components/layout/DefaultLayout";
import MainPage from "@/pages/MainPage";
import PageNotFound from "@/pages/PageNotFound";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<MainPage />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default Router;

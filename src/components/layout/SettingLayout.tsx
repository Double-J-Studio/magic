import { Outlet } from "react-router-dom";

import SettingPageMenu from "@/components/SettingPageMenu";

const SettingLayout = () => {
  return (
    <div className="flex w-full h-full min-w-screen min-h-screen rounded-lg">
      <SettingPageMenu />

      <div className="w-[70%] min-w-[calc(100%-260px)]">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingLayout;

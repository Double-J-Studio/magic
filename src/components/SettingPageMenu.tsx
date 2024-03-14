import { useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import useSettingMenuStore from "@/state/useSettingMenuStore";

const MENU_LIST = [
  { id: "1", path: "/setting/api-key-setting", name: "API Key Setting" },
  { id: "2", path: "/setting/image-gallery", name: "Image Gallery" },
];

const SettingPageMenu = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { selectedMenuItem, setSelectedMenuItem } = useSettingMenuStore();

  useEffect(() => {
    setSelectedMenuItem(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleMenuClick = (path: string) => {
    setSelectedMenuItem(path);
    navigate(path);
  };

  return (
    <nav className="flex flex-col flex-1 justify-between w-full h-full min-h-screen p-3 overflow-y-auto shadow-lg">
      <ul className="flex flex-col gap-1 min-h-[90%] py-5">
        {MENU_LIST.map((item) => {
          return (
            <li
              key={`menu_${item.id}`}
              className={`w-full p-2 ${selectedMenuItem === item.path ? "bg-gray-200" : "hover:bg-gray-100"} rounded-lg text-gray-700 text-sm font-medium cursor-pointer`}
              onClick={() => handleMenuClick(item.path)}
            >
              {item.name}
            </li>
          );
        })}
      </ul>

      <div className="w-full">
        <Button
          size="sm"
          variant="ghost"
          className="flex justify-start items-center gap-1 w-full"
          onClick={() => navigate("/")}
        >
          <span className="text-gray-500 font-semibold">
            Back to the Main page
          </span>
        </Button>
      </div>
    </nav>
  );
};

export default SettingPageMenu;

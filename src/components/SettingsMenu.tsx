import { useEffect } from "react";

import { useLocation } from "react-router-dom";

import useSettingMenuStore from "@/state/useSettingMenuStore";

const MENU_LIST = [
  { id: "1", value: "api-key-setting", name: "API Key Setting" },
  { id: "2", value: "image-gallery", name: "Image Gallery" },
];

const SettingsMenu = () => {
  const { pathname } = useLocation();

  const { selectedMenuItem, setSelectedMenuItem } = useSettingMenuStore();

  useEffect(() => {
    setSelectedMenuItem(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleMenuClick = (path: string) => {
    setSelectedMenuItem(path);
  };

  return (
    <nav className="flex flex-col flex-1 justify-between w-[30%] sm:min-w-40 lg:max-w-64 min-h-full p-3 overflow-y-auto shadow-lg">
      <ul className="flex flex-col gap-1 h-full">
        {MENU_LIST.map((item) => {
          return (
            <li
              key={`menu_${item.id}`}
              className={`w-full p-2 ${selectedMenuItem === item.value ? "bg-gray-200" : "hover:bg-gray-100"} rounded-lg text-gray-700 text-sm font-medium cursor-pointer`}
              onClick={() => handleMenuClick(item.value)}
            >
              {item.name}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SettingsMenu;

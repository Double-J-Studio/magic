import useSettingsStore from "@/state/useSettingsStore";

import { MENU_LIST } from "@/constant";

const SettingsMenu = () => {
  const { selectedMenuItem, setSelectedMenuItem } = useSettingsStore();

  const handleMenuClick = (value: string) => {
    setSelectedMenuItem(value);
  };

  return (
    <nav className="flex flex-col flex-1 justify-between w-[30%] sm:min-w-40 lg:max-w-64 min-h-full p-3 overflow-y-auto">
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

import useSettingMenuStore from "@/state/useSettingMenuStore";

const MENU_LIST = ["API Key Setting", "Image Gallery"];

const SettingPageMenu = () => {
  const { selectedMenuItem, setSelectedMenuItem } = useSettingMenuStore();

  return (
    <div className="flex-col flex-1 w-full h-full min-h-[calc(100vh-58px)] max-h-[calc(100vh-58px)] overflow-y-auto">
      <ul className="py-5">
        {MENU_LIST.map((item, i) => {
          return (
            <li
              key={`conversation_${i}`}
              className={`w-full p-2 ${selectedMenuItem === item ? "bg-gray-200" : "hover:bg-gray-100"} rounded-lg text-gray-700 text-sm font-medium cursor-pointer`}
              onClick={() => setSelectedMenuItem(item)}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SettingPageMenu;

import dayjs from "dayjs";
import { Cog6ToothIcon, UserCircleIcon } from "@heroicons/react/20/solid";

import { useGetConversations } from "@/hooks/db/useGetConversations";

import { Button } from "@/components/ui/button";
import Conversations from "@/components/Conversations";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SettingsDialog from "@/components/SettingsDialog";

import { Conversation } from "@/state/useConversationStore";
import useSideBarStore from "@/state/useSidebarStore";
import useSettingsStore from "@/state/useSettingsStore";

const sidebarStyles = {
  base: "relative w-[260px] min-h-screen bg-[#fafafa] transition-all duration-500 transform",
  open: "translate-x-0",
  close: "translate-x-0 ml-[-260px]",
};

const Sidebar = () => {
  const { isOpen } = useSideBarStore();
  const { open } = useSettingsStore();

  const { conversations, isLoading } = useGetConversations();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const groupByConversations = (data: any) => {
    return data.reduce((acc: any, item: any) => {
      const today = dayjs();
      const month = dayjs(item.createdAt).format("YYYY-MM");
      const year = dayjs(item.createdAt).format("YYYY");
      const yearDiff = dayjs().diff(item.createdAt, "year");

      if (yearDiff === 0) {
        if (dayjs().isSame(item.createdAt, "day")) {
          const formattedToday = today.format("YYYY-MM-DD");
          acc[formattedToday] = acc[formattedToday] || [];
          acc[formattedToday].push(item);
        } else if (
          !dayjs().isSame(item.createdAt, "day") &&
          dayjs().subtract(1, "day").isSame(item.createdAt, "day")
        ) {
          const formattedYesterday = dayjs()
            .subtract(1, "day")
            .format("YYYY-MM-DD");
          acc[formattedYesterday] = acc[formattedYesterday] || [];
          acc[formattedYesterday].push(item);
        } else if (
          !dayjs().isSame(item.createdAt, "day") &&
          dayjs(item.createdAt).isAfter(today.subtract(7, "day")) &&
          dayjs(item.createdAt).isBefore(today)
        ) {
          const formattedPrevious7days = today
            .subtract(7, "day")
            .format("YYYY-MM-DD");
          acc[formattedPrevious7days] = acc[formattedPrevious7days] || [];
          acc[formattedPrevious7days].push(item);
        } else if (
          !dayjs().isSame(item.createdAt, "day") &&
          dayjs(item.createdAt).isAfter(today.subtract(30, "day")) &&
          dayjs(item.createdAt).isBefore(today)
        ) {
          const formattedPrevious30days = today
            .subtract(30, "day")
            .format("YYYY-MM-DD");
          acc[formattedPrevious30days] = acc[formattedPrevious30days] || [];
          acc[formattedPrevious30days].push(item);
        } else {
          acc[month] = acc[month] || [];
          acc[month].push(item);
        }
      } else {
        acc[year] = acc[year] || [];
        acc[year].push(item);
      }

      return acc;
    }, {});
  };

  const handleSettingsBtnClick = () => {
    open();
  };

  const groupedByConversations = groupByConversations(conversations);
  function processData(data: { [key: string]: Conversation[] }) {
    Object.keys(data)
      ?.map((key: string) => {
        return data[key].reverse();
      })
      .reverse();

    return data;
  }

  return (
    <aside
      className={`${sidebarStyles.base} ${isOpen ? sidebarStyles.open : sidebarStyles.close}`}
    >
      <nav className="flex flex-col gap-2 h-full items-center justify-center pl-3 pb-3.5">
        <div className="flex flex-col w-full h-full">
          <Conversations data={processData(groupedByConversations)} />
        </div>
        <div className="flex w-full pr-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="flex justify-start items-center gap-1 w-full px-2"
              >
                <div
                  className={`flex justify-center w-6 h-6 bg-slate-200 rounded-full overflow-hidden`}
                >
                  <UserCircleIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-gray-500 font-semibold">User</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-full max-w-[236px] p-1.5">
              <Button
                size="sm"
                variant="ghost"
                className="flex justify-start items-center gap-1 w-full"
                onClick={handleSettingsBtnClick}
              >
                <Cog6ToothIcon className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500 font-semibold">Settings</span>
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </nav>

      <div
        className={`absolute right-0 bottom-0 w-6 min-h-screen bg-gradient-to-r from-transparent to-[#fafafa]`}
      />
      <SettingsDialog />
    </aside>
  );
};

export default Sidebar;

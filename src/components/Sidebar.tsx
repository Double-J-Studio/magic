import { Cog6ToothIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import Conversations from "@/components/Conversations";

import useConversationStore from "@/state/useConversationStore";

const Sidebar = () => {
  const navigate = useNavigate();

  const { conversations } = useConversationStore();

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

  return (
    <>
      <ResizablePanel
        defaultSize={30}
        maxSize={30}
        className="max-w-[260px] h-full"
      >
        <div className="flex flex-col gap-2 h-full items-center justify-center px-3 pb-3.5">
          <div className="flex flex-col w-full h-full">
            <Conversations data={groupByConversations(conversations)} />
          </div>
          <div className="w-full">
            <Button
              size="sm"
              variant="ghost"
              className="flex justify-start items-center gap-1 w-full"
              onClick={() => navigate("/api-key-setting")}
            >
              <Cog6ToothIcon className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 font-semibold">Setting</span>
            </Button>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className="border border-gray-200" />
    </>
  );
};

export default Sidebar;

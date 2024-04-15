import { useEffect, useState } from "react";

import dayjs from "dayjs";
import { UserCircleIcon } from "@heroicons/react/20/solid";

import { useGetConversations } from "@/hooks/db/useGetConversations";
import { kv } from "@/utils/tauri/kv";

import { Button } from "@/components/ui/button";
import Conversations from "@/components/Conversations";
import SettingsDialog from "@/components/SettingsDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { Conversation } from "@/state/useConversationStore";
import useSideBarStore from "@/state/useSidebarStore";
import useSettingsStore from "@/state/useSettingsStore";

const sidebarStyles = {
  base: "relative w-[260px] min-h-screen bg-[#fafafa] transition-all duration-500 transform",
  open: "translate-x-0",
  close: "translate-x-0 ml-[-260px]",
};

const Sidebar = () => {
  const [loading, setLoading] = useState(false);
  const { isOpen } = useSideBarStore();
  const { profileImageUrl, userName, open, setUserName, setProfileImageUrl } =
    useSettingsStore();

  const { conversations, isLoading } = useGetConversations();

  useEffect(() => {
    async function getProfileImageAndUserName() {
      setLoading(true);
      try {
        const profileImage = await kv.get<string>("profileImage");
        const userName = await kv.get<string>("userName");

        setProfileImageUrl(profileImage);
        if (userName) {
          setUserName(userName);
          return;
        }
        setUserName("User");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getProfileImageAndUserName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]);

  if (isLoading) {
    return <Skeleton className="min-w-[260px] min-h-screen" />;
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
          <Button
            size="sm"
            variant="ghost"
            className="flex justify-start items-center gap-x-2 w-full px-2"
            onClick={handleSettingsBtnClick}
          >
            <div
              className={`flex justify-center w-8 h-8 bg-slate-200 rounded-full overflow-hidden`}
            >
              {profileImageUrl ? (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profileImageUrl} alt="Profile Image" />
                  <AvatarFallback>
                    <Skeleton className="w-full h-full rounded-full" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <UserCircleIcon className="w-full h-full text-white" />
              )}
            </div>
            {!loading ? (
              <span className="w-[calc(100%-32px)] text-left text-gray-500 font-semibold truncate">
                {userName}
              </span>
            ) : (
              <Skeleton className="w-[calc(100%-32px)] h-5" />
            )}
          </Button>
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

import { Outlet } from "react-router-dom";

import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Sidebar from "@/components/Sidebar";

const DefaultLayout = () => {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full min-w-screen min-h-screen rounded-lg"
    >
      <Sidebar />

      <ResizablePanel defaultSize={70} className="min-w-[calc(100%-260px)]">
        <Outlet />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default DefaultLayout;

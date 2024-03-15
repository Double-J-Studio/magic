import { Outlet } from "react-router-dom";

import Sidebar from "@/components/Sidebar";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import AlertDestructive from "@/components/AlertDestructive";

import useAlertStore from "@/state/useAlertStore";

const DefaultLayout = () => {
  const { isOpen } = useAlertStore();

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="relative h-full min-w-screen min-h-screen rounded-lg"
    >
      <Sidebar />

      <ResizablePanel defaultSize={70} className="min-w-[calc(100%-260px)]">
        <Outlet />
      </ResizablePanel>

      {isOpen && <AlertDestructive />}
    </ResizablePanelGroup>
  );
};

export default DefaultLayout;

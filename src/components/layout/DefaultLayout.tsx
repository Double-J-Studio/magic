import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const DefaultLayout = () => {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full min-w-screen min-h-screen rounded-lg"
    >
      <ResizablePanel defaultSize={30} maxSize={30} className="max-w-[260px]">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Sidebar</span>
        </div>
        <div>
          <div>123</div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle className="border border-gray-300" />

      <ResizablePanel defaultSize={70} className="min-w-[calc(100%-260px)]">
        <Outlet />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default DefaultLayout;

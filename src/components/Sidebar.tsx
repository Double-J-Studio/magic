import { Cog6ToothIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <>
      <ResizablePanel defaultSize={30} maxSize={30} className="max-w-[260px]">
        <div className="flex flex-col h-full items-center justify-center p-6">
          <div className="h-full"></div>
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

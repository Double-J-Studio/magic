import { Outlet } from "react-router-dom";

import Sidebar from "@/components/Sidebar";
import AlertDestructive from "@/components/AlertDestructive";
import { Toaster } from "@/components/ui/toaster";

import useAlertStore from "@/state/useAlertStore";

const DefaultLayout = () => {
  const { isOpen } = useAlertStore();

  return (
    <div className="relative flex w-screen h-full min-h-screen">
      <Sidebar />

      <div className="w-screen">
        <Outlet />
      </div>

      {isOpen && <AlertDestructive />}
      <Toaster />
    </div>
  );
};

export default DefaultLayout;

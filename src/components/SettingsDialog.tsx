import { useEffect, useState } from "react";

import { getVersion } from "@tauri-apps/api/app";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SettingsLayout from "@/components/layout/SettingsLayout";

import useSettingsStore from "@/state/useSettingsStore";

const SettingsDialog = () => {
  const { isOpen, toggle } = useSettingsStore();
  const [appVersion, setAppVersion] = useState("");

  useEffect(() => {
    async function getAppVersion() {
      const appVersion = await getVersion();

      setAppVersion(appVersion);
    }

    getAppVersion();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogContent
        className="flex flex-col gap-0 w-[70%] max-w-screen-lg min-h-fit max-h-[80%] p-0 overflow-auto focus:outline-none"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        <div className="relative p-6 border-b border-gray-100">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
        </div>

        <SettingsLayout />
        <div className="absolute bottom-3 left-6 text-xs">v{appVersion}</div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;

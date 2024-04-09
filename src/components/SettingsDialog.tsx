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

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogContent
        className="flex flex-col gap-0 w-[70%] max-w-screen-lg h-[70%] p-0 overflow-auto focus:outline-none"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        <div className="p-6 border-b border-gray-100">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
        </div>

        <SettingsLayout />
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;

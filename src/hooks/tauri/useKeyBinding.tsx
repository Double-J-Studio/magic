import { useEffect } from "react";

import { register, unregisterAll } from "@tauri-apps/api/globalShortcut";
import {} from "@tauri-apps/api/fs";
import { invoke } from "@tauri-apps/api/tauri";

function useKeyBinding() {
  useEffect(() => {
    register("CommandOrControl+U", () => {
      invoke("toggle_window").then(console.log).catch(console.error);
    });

    return () => {
      unregisterAll();
    };
  }, []);
}

export default useKeyBinding;

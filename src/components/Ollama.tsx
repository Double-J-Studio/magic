import { useEffect } from "react";

import { CheckIcon } from "@heroicons/react/20/solid";

import { getOllamaVersion } from "@/utils/tauri/ollama";

import { Skeleton } from "@/components/ui/skeleton";
import SettingsContentLayout from "@/components/SettingsContentLayout";

import useSettingsStore from "@/state/useSettingsStore";

const Ollama = () => {
  const { isLoading, ollamaVersion, setIsLoading, setOllamaVersion } =
    useSettingsStore();

  useEffect(() => {
    async function checkOllamaVersion() {
      setIsLoading(true);
      try {
        const version = await getOllamaVersion();
        if (!version) {
          return;
        }
        setOllamaVersion(version as string);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (ollamaVersion) {
      return;
    }

    checkOllamaVersion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SettingsContentLayout title="Ollama">
      <div className="flex flex-col gap-2">
        <p>Download Ollama</p>

        <div className="flex gap-2">
          {isLoading ? (
            <Skeleton className="min-w-[120px] w-full h-6 rounded-md" />
          ) : ollamaVersion ? (
            <>
              <CheckIcon className="w-5 h-5 text-green-800" />{" "}
              <span>Installed</span>
            </>
          ) : (
            <p className="px-2">
              Click{" "}
              <a
                href="https://ollama.com/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline"
              >
                here
              </a>{" "}
              to download
            </p>
          )}
        </div>
      </div>
    </SettingsContentLayout>
  );
};

export default Ollama;

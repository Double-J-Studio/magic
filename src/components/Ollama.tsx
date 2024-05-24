import { useEffect } from "react";

import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";

import { getOllamaVersion } from "@/utils/tauri/ollama";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="flex items-center justify-center min-w-full py-10 overflow-auto">
      <Card className="w-full max-w-[80%] h-[80%] p-10 shadow-lg">
        <CardHeader className="px-0">Download Ollama</CardHeader>
        <CardContent className="flex flex-col gap-3 p-0">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Ollama;

import { PaperAirplaneIcon } from "@heroicons/react/20/solid";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  return (
    <main className="flex flex-col justify-between w-full h-full p-6">
      <section className="h-[90%]">
        <h2>Magic</h2>
      </section>

      <div className="flex items-center justify-center w-full">
        <div className="relative grid w-[60%] gap-2">
          <Textarea
            placeholder="Type your message here."
            rows={1}
            className={cn(
              "leading-8 border-2 border-gray-400 resize-none focus-visible:ring-0 ring-0"
            )}
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="absolute top-2/4 right-3 translate-y-[-50%] w-[32px] h-[32px] p-0">
                  <PaperAirplaneIcon className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </main>
  );
};

export default MainPage;

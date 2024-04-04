import { ReactNode } from "react";

import { TooltipArrow } from "@radix-ui/react-tooltip";

import {
  Tooltip as TooltipWrapper,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipWrapperProps {
  children: ReactNode;
  delayDuration?: number;
  side: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  description: string;
  className?: string;
}

const Tooltip = ({
  children,
  delayDuration = 100,
  side,
  sideOffset = 5,
  description,
  className,
}: TooltipWrapperProps) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipWrapper>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          sideOffset={sideOffset}
          align="center"
          className={`z-50 bg-black border-black text-gray-100 ${className}`}
        >
          <p>{description}</p>
          <TooltipArrow className="animate-in fade-in-0 zoom-in-95" />
        </TooltipContent>
      </TooltipWrapper>
    </TooltipProvider>
  );
};

export default Tooltip;

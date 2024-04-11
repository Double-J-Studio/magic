import { ClassAttributes, HTMLAttributes } from "react";

import CopyToClipboard from "react-copy-to-clipboard";
import DocumentDuplicateIcon from "@heroicons/react/24/outline/DocumentDuplicateIcon";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import { ExtraProps } from "react-markdown";

import { useToast } from "@/hooks/useToast";

import { Button } from "@/components/ui/button";

interface PreProps {
  pre: ClassAttributes<HTMLPreElement> &
    HTMLAttributes<HTMLPreElement> &
    ExtraProps;
}

const Pre = ({ pre }: PreProps) => {
  const { toast } = useToast();
  const codeChunk = (pre as any)?.node.children[0].children[0].value as string;
  const language = (pre as any)?.children?.props?.className?.replace(
    /language-/g,
    ""
  ) as string;

  return (
    <div className="relative md:max-w-[600px] lg:max-w-full overflow-x-hidden">
      <Button
        variant="ghost"
        className="z-40 absolute top-0.5 right-2 w-8 h-8 p-1 text-zinc-50 hover:bg-zinc-500"
        onClick={() => {
          toast({
            description: (
              <div className="flex items-center gap-1">
                <CheckIcon className="w-4 h-4 text-green-700" />
                <p>Copied to clipboard!</p>
              </div>
            ),
            className: "font-semibold",
            duration: 2000,
          });
        }}
      >
        <CopyToClipboard
          text={codeChunk}
          onCopy={async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }}
        >
          <DocumentDuplicateIcon className="w-4 h-4 text-white cursor-pointer" />
        </CopyToClipboard>
      </Button>

      <span className="z-40 absolute top-0 right-12 h-9 leading-9 text-xs text-gray-100 uppercase text-base-300">
        {language}
      </span>
      <pre {...pre}></pre>
    </div>
  );
};

export default Pre;

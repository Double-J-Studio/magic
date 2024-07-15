import { ComponentType, ReactElement, ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SettingsContentLayout = ({
  title,
  description,
  headerClassName = "",
  HeaderButton,
  children,
}: {
  title?: string;
  description?: string;
  headerClassName?: string;
  HeaderButton?: ReactElement;
  children: ReactNode;
}) => {
  return (
    <div className="flex items-center justify-center min-w-full py-10 overflow-auto">
      <Card className="w-full max-w-[80%] h-[80%] p-6 shadow-lg">
        {title && (
          <CardHeader className={`relative flex p-0 ${headerClassName}`}>
            <CardTitle className="">{title}</CardTitle>
            {HeaderButton}
            {description && (
              <CardDescription className="mt-2">{description}</CardDescription>
            )}
          </CardHeader>
        )}

        <CardContent className="flex flex-col gap-3 p-0 mt-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsContentLayout;

import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import useAlertStore from "@/state/useAlertStore";

const AlertDestructive = () => {
  const navigate = useNavigate();
  const { close, information } = useAlertStore();

  const handleAlertClose = () => {
    close();
    if (information?.pathname) {
      navigate(information.pathname);
    }
  };

  return (
    <div
      className={`absolute top-0 right-0 flex items-center justify-center w-full h-full min-w-screen min-h-screen backdrop-blur-sm`}
    >
      <Alert
        variant="destructive"
        className="z-50 relative max-w-[50%] bg-white border-gray-300 shadow-md"
      >
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="text-gray-500">
          {information?.description}
        </AlertDescription>

        <div className="w-full flex justify-end mt-3">
          <Button
            type="button"
            variant="outline"
            className="p-2 text-gray-600"
            onClick={handleAlertClose}
          >
            Confirm
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default AlertDestructive;

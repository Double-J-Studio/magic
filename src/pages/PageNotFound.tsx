import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className=" flex flex-col items-center justify-center gap-5 w-screen">
      <div className="flex flex-col gap-2">
        <div className="text-center font-bold">
          <span className="text-9xl">404</span>
          <p>Page not found</p>
        </div>
        <p>Sorry, we couldn't find this page.</p>
      </div>

      <Button type="button" variant="default" onClick={() => navigate("/")}>
        Back to main page
      </Button>
    </div>
  );
};

export default PageNotFound;

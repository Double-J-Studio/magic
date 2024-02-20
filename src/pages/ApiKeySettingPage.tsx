import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { kv } from "@/utils/tauri/kv";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ApiKeySettingPage = () => {
  const navigate = useNavigate();

  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    kv.get<string>("api_key").then((apiKey) => setApiKey(apiKey || ""));
  }, []);

  const handleSaveBtnClick = () => {
    kv.set("api_key", apiKey);
    alert("API key has been saved.");
  };

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.currentTarget.value);
  };

  return (
    <div>
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>API Key Setting</CardTitle>
          <CardDescription>
            Manage your API key. You can create multiple API keys to use with
            your applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Label htmlFor="apiKey" className="flex items-center">
              API Key
            </Label>
            <Input
              id="apiKey"
              placeholder="Enter your API key"
              className="w-[85%]"
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e)}
            />
            <Button
              type="button"
              size="sm"
              className="h-10"
              onClick={handleSaveBtnClick}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-10"
          onClick={() => navigate("/")}
        >
          Back to the main page
        </Button>
      </div>
    </div>
  );
};

export default ApiKeySettingPage;

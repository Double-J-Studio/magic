import { ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { kv } from "@/utils/tauri/kv";
import { capitalizeFirstLetter } from "@/lib/utils";
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
import useApiKeyStore, { ApiKey } from "@/state/useApiKeyStore";

const ApiKeySettingPage = () => {
  const navigate = useNavigate();
  const { apiKeys, setApiKeys } = useApiKeyStore();

  useEffect(() => {
    kv.get<ApiKey[]>("api_keys").then((apiKeys) => {
      if (!apiKeys) {
        return;
      }

      if (apiKeys) {
        const services = ["openai", "bing", "groq"];
        if (apiKeys.length < 3) {
          const existedServices = apiKeys.map((apiKey) => apiKey.service);
          const filteredServices = services.filter(
            (service) => !existedServices.includes(service)
          );

          if (filteredServices.length > 0) {
            filteredServices.forEach((service) => {
              apiKeys.push({ key: "", service: service });
            });
          }
        }

        setApiKeys(apiKeys);
      }
    });
  }, []);

  const handleSaveBtnClick = (service: string) => {
    kv.set("api_keys", apiKeys);
    alert(`${capitalizeFirstLetter(service)} API key has been saved.`);
  };

  const handleApiKeyChange = (
    e: ChangeEvent<HTMLInputElement>,
    service: string
  ) => {
    const clone = JSON.parse(JSON.stringify(apiKeys));
    switch (service) {
      case "openai":
        clone[0].key = e.currentTarget.value;
        break;
      case "bing":
        clone[1].key = e.currentTarget.value;
        break;
      case "groq":
        clone[2].key = e.currentTarget.value;
        break;
    }

    setApiKeys(clone);
  };

  return (
    <div>
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle>API Key Setting</CardTitle>
          <CardDescription>
            Manage your API key. You can create multiple API keys to use with
            your applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3>OpenAI</h3>
            <div className="flex gap-2">
              <Label htmlFor="apiKey" className="flex items-center">
                API Key
              </Label>
              <Input
                id="apiKey"
                placeholder="Enter your API key"
                className="w-[85%]"
                value={apiKeys[0].key}
                onChange={(e) => handleApiKeyChange(e, "openai")}
              />
              <Button
                type="button"
                size="sm"
                className="h-10"
                onClick={() => handleSaveBtnClick("openai")}
              >
                Save
              </Button>
            </div>
          </div>

          <div>
            <h3>Bing</h3>
            <div className="flex gap-2">
              <Label htmlFor="apiKey" className="flex items-center">
                API Key
              </Label>
              <Input
                id="apiKey"
                placeholder="Enter your API key"
                className="w-[85%]"
                value={apiKeys[1].key}
                onChange={(e) => handleApiKeyChange(e, "bing")}
              />
              <Button
                type="button"
                size="sm"
                className="h-10"
                onClick={() => handleSaveBtnClick("bing")}
              >
                Save
              </Button>
            </div>
          </div>

          <div>
            <h3>Groq</h3>
            <div className="flex gap-2">
              <Label htmlFor="apiKey" className="flex items-center">
                API Key
              </Label>
              <Input
                id="apiKey"
                placeholder="Enter your API key"
                className="w-[85%]"
                value={apiKeys[2].key}
                onChange={(e) => handleApiKeyChange(e, "groq")}
              />
              <Button
                type="button"
                size="sm"
                className="h-10"
                onClick={() => handleSaveBtnClick("groq")}
              >
                Save
              </Button>
            </div>
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

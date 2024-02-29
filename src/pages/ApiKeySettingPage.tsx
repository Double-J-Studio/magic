import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ApiKeyInput from "@/components/ApiKeyInput";
import useApiKeyStore from "@/state/useApiKeyStore";
import { checkApiKeys } from "@/utils/api-key-check";

const ApiKeySettingPage = () => {
  const navigate = useNavigate();

  const { apiKeys, setApiKeys } = useApiKeyStore();
  const openaiApiKey = apiKeys[0].key;
  const bingApiKey = apiKeys[1].key;
  const groqApiKey = apiKeys[2].key;

  useEffect(() => {
    checkApiKeys(setApiKeys);
  }, []);

  return (
    <div>
      <Card className="w-full min-w-[800px] shadow-lg">
        <CardHeader>
          <CardTitle>API Key Setting</CardTitle>
          <CardDescription>
            Manage your API key. You can create multiple API keys to use with
            your applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ApiKeyInput service="openai" title="OpenAI" value={openaiApiKey} />
          <ApiKeyInput service="bing" title="Bing" value={bingApiKey} />
          <ApiKeyInput service="groq" title="Groq" value={groqApiKey} />
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

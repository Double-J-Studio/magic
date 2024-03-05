import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { checkApiKeys } from "@/utils/api-key-check";

import ApiKeyInput from "@/components/ApiKeyInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import useApiKeyStore from "@/state/useApiKeyStore";

const ApiKeySettingPage = () => {
  const navigate = useNavigate();

  const { apiKeys, setApiKeys } = useApiKeyStore();
  const openaiApiKey = apiKeys[0].key;
  const bingApiKey = apiKeys[1].key;
  const groqApiKey = apiKeys[2].key;

  useEffect(() => {
    checkApiKeys(setApiKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

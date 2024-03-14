import { useEffect } from "react";

import { checkApiKeys } from "@/utils/api-key-check";

import ApiKeyInput from "@/components/ApiKeyInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import useApiKeyStore from "@/state/useApiKeyStore";

const ApiKeySettingPage = () => {
  const { apiKeys, setApiKeys } = useApiKeyStore();
  const openaiApiKey = apiKeys[0].key;
  const bingApiKey = apiKeys[1].key;
  const groqApiKey = apiKeys[2].key;
  const geminiApiKey = apiKeys[3].key;

  useEffect(() => {
    checkApiKeys(setApiKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-[80%] h-[50%] shadow-lg">
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
          <ApiKeyInput service="gemini" title="Gemini" value={geminiApiKey} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeySettingPage;

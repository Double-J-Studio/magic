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

const ApiKeySetting = () => {
  const { setApiKeys } = useApiKeyStore();

  const openaiApiKey = useApiKeyStore((state) => state.getOpenaiApiKey());
  const bingApiKey = useApiKeyStore((state) => state.getBingApiKey());
  const groqApiKey = useApiKeyStore((state) => state.getGroqApiKey());
  const geminiApiKey = useApiKeyStore((state) => state.getGeminiApiKey());

  useEffect(() => {
    checkApiKeys(setApiKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center min-w-full h-full">
      <Card className="w-full max-w-[80%] h-[80%] shadow-lg">
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

export default ApiKeySetting;

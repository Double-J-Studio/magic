import { useEffect } from "react";

import { checkApiKeys } from "@/utils/check";

import ApiKeyInput from "@/components/ApiKeyInput";
import SettingsContentLayout from "@/components/SettingsContentLayout";

import useApiKeyStore from "@/state/useApiKeyStore";

const ApiKeySetting = () => {
  const { setApiKeys } = useApiKeyStore();

  const openaiApiKey = useApiKeyStore((state) => state.getApiKey("openai"));
  const groqApiKey = useApiKeyStore((state) => state.getApiKey("groq"));
  const geminiApiKey = useApiKeyStore((state) => state.getApiKey("gemini"));

  useEffect(() => {
    checkApiKeys(setApiKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SettingsContentLayout
      title="API Key Setting"
      description="Manage your API key. You can create multiple API keys to use with
    your applications."
    >
      <ApiKeyInput service="openai" title="OpenAI" value={openaiApiKey} />
      <ApiKeyInput service="groq" title="Groq" value={groqApiKey} />
      <ApiKeyInput service="gemini" title="Gemini" value={geminiApiKey} />
    </SettingsContentLayout>
  );
};

export default ApiKeySetting;

import { ChangeEvent, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { kv } from "@/utils/tauri/kv";
import { capitalizeFirstLetter } from "@/lib/utils";
import useApiKeyStore from "@/state/useApiKeyStore";

interface ApiKeyInputProps {
  title: string;
  service: string;
  value: string;
}

const ApiKeyInput = ({ title, service, value }: ApiKeyInputProps) => {
  const [toggle, setToggle] = useState(false);

  const { apiKeys, setApiKeys } = useApiKeyStore();

  const handleSaveBtnClick = async (service: string) => {
    await kv.set("api_keys", apiKeys);
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

  const handleInputTypeChange = () => {
    setToggle((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-gray-500">{title}</h3>
      <div className="flex gap-2 w-full">
        <div className="relative flex gap-2 w-full">
          <Label htmlFor="apiKey" className="flex items-center">
            API Key
          </Label>
          <Input
            id="apiKey"
            type={toggle ? "text" : "password"}
            placeholder="Enter your API key"
            className="w-full"
            value={value}
            onChange={(e) => handleApiKeyChange(e, service)}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute top-0 right-0 flex justify-center items-center h-full"
            onClick={() => handleInputTypeChange()}
          >
            {toggle ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </Button>
        </div>
        <Button
          type="button"
          size="sm"
          className="h-10"
          onClick={() => handleSaveBtnClick(service)}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ApiKeyInput;

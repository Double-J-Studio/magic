import { ChangeEvent, useEffect, useRef, useState } from "react";

import {
  CameraIcon,
  CheckIcon,
  PencilIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";

import { kv } from "@/utils/tauri/kv";
import { blobToBase64 } from "@/utils/convert";
import { useToast } from "@/hooks/useToast";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Tooltip from "@/components/Tooltip";
import SettingsContentLayout from "@/components/SettingsContentLayout";

import useSettingsStore from "@/state/useSettingsStore";

interface FormData {
  name: string;
}

const Profile = () => {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { userName, profileImageUrl, setUserName, setProfileImageUrl } =
    useSettingsStore();
  const { register, handleSubmit, setValue, setFocus, reset } =
    useForm<FormData>({
      defaultValues: {
        name: "",
      },
    });
  const { toast } = useToast();

  useEffect(() => {
    setValue("name", userName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isReadOnly) {
      setFocus("name");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReadOnly]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent): void {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setIsReadOnly(true);
        reset({ name: userName });
      }
    }

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef]);

  const handleMyPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (fileList && fileList[0]) {
      const imgUrl = URL.createObjectURL(fileList[0]);
      const base64 = await blobToBase64(imgUrl);
      await kv.set("profileImage", base64);

      setProfileImageUrl(base64 as string);
    }
  };

  const handleFormSubmit = async (data: FormData, e: any) => {
    setIsReadOnly((prev) => !prev);

    if (!(e.nativeEvent instanceof SubmitEvent)) return;
    const submitter = e?.nativeEvent?.submitter as HTMLButtonElement;
    const buttonName = submitter.name;

    if (buttonName === "save") {
      setUserName(data.name);
      await kv.set("userName", data.name);

      toast({
        description: (
          <div className="flex items-center gap-1">
            <CheckIcon className="w-4 h-4 text-green-700" />
            <p>Name updated successfully!</p>
          </div>
        ),
        className: "font-semibold",
        duration: 2000,
      });
    }
  };

  return (
    <SettingsContentLayout title="Profile">
      <div className="relative flex items-center justify-center">
        <label htmlFor="fileUpload" className="sr-only">
          Image File Upload
        </label>
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          accept="image/jpg, image/png, image/jpeg"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div
          className="relative w-32 h-32 rounded-full cursor-pointer"
          onClick={handleMyPhotoClick}
        >
          {profileImageUrl ? (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img
              src={profileImageUrl || ""}
              alt="Profile Image"
              className="w-full h-full rounded-full"
            />
          ) : (
            <UserCircleIcon className="w-full h-full text-gray-300 rounded-full" />
          )}

          <Tooltip side="right" description="Image Upload">
            <Button
              type="button"
              variant="ghost"
              className="absolute right-1 bottom-0 w-10 h-10 p-1 rounded-full group/button hover:bg-transparent"
            >
              <span className="sr-only">Image Upload</span>
              <CameraIcon className="w-5 h-5 group-hover/button:text-gray-600" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1">
        <form
          className="relative"
          onSubmit={handleSubmit((data, e) => handleFormSubmit(data, e))}
          ref={formRef}
        >
          <Label htmlFor="userName" className="sr-only">
            Name
          </Label>
          <Input
            id="userName"
            className={`w-52 px-11 text-center focus-visible:ring-transparent ${isReadOnly ? "border-0" : ""}`}
            placeholder="Name"
            readOnly={isReadOnly}
            {...register("name")}
          />
          <Tooltip side="top" description={isReadOnly ? "Modify" : "Save"}>
            <Button
              type="submit"
              variant="ghost"
              className="absolute top-0 right-0 group/button hover:bg-transparent "
              name={isReadOnly ? "modify" : "save"}
            >
              <span className="sr-only">{isReadOnly ? "Modify" : "Save"}</span>
              <PencilIcon className="w-3 h-3 group-hover/button:text-gray-600" />
            </Button>
          </Tooltip>
        </form>
      </div>
    </SettingsContentLayout>
  );
};

export default Profile;

import { ChangeEvent, useEffect, useRef, useState } from "react";

import {
  CameraIcon,
  PencilIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";

import { kv } from "@/utils/tauri/kv";
import { blobToBase64 } from "@/utils/convert";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Tooltip from "@/components/Tooltip";

import useSettingsStore from "@/state/useSettingsStore";

const Profile = () => {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const { userName, profileImageUrl, setUserName, setProfileImageUrl } =
    useSettingsStore();

  useEffect(() => {
    if (!isReadOnly && nameInputRef.current) {
      console.log("");

      nameInputRef.current.focus();
    }
  }, [isReadOnly]);

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

  return (
    <div className="flex items-center justify-center min-w-full py-10 overflow-auto">
      <Card className="w-full max-w-[80%] h-[80%] p-10 shadow-lg">
        <CardContent className="flex flex-col gap-3 p-0">
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
            <div className="relative">
              <Label htmlFor="userName" className="sr-only">
                Name
              </Label>
              <Input
                id="userName"
                className={`w-52 px-11 text-center focus-visible:ring-transparent ${isReadOnly ? "border-0" : ""}`}
                placeholder="Name"
                readOnly={isReadOnly}
                value={userName || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUserName(e.currentTarget.value)
                }
                ref={nameInputRef}
              />
              <Tooltip side="top" description={isReadOnly ? "Modify" : "Save"}>
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute top-0 right-0 group/button hover:bg-transparent "
                  onClick={async () => {
                    setIsReadOnly((prev) => !prev);

                    if (!isReadOnly) {
                      await kv.set("userName", userName);
                    }
                  }}
                >
                  <span className="sr-only">
                    {isReadOnly ? "Modify" : "Save"}
                  </span>
                  <PencilIcon className="w-3 h-3 group-hover/button:text-gray-600" />
                </Button>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

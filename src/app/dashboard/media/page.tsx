"use client";
import Show from "@/components/Show";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MediaLibrary from "@/components/uploader/MediaLibrary";
import UploadFile from "@/components/uploader/UploadFile";
import { setDeleteImage } from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useState } from "react";

const Page = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<string>("uploadFile");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Card className="flex flex-col gap-4 m-2 sm:m-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            onClick={() => handleTabClick("uploadFile")}
            size="sm"
            className={`${
              activeTab === "uploadFile"
                ? "bg-primary text-white hover:bg-secondary"
                : "border border-primary bg-inherit text-inherit hover:bg-inherit"
            }`}
          >
            Upload File
          </Button>
          <Button
            onClick={() => handleTabClick("mediaLibrary")}
            size="sm"
            className={`${
              activeTab === "mediaLibrary"
                ? "bg-primary text-white hover:bg-secondary"
                : "border border-primary bg-inherit text-inherit hover:bg-inherit"
            }`}
          >
            Media Library
          </Button>
        </div>
        {activeTab === "mediaLibrary" && (
          <div className="flex items-center gap-3">
            <Button
              onClick={() => dispatch(setDeleteImage([]))}
              className="py-1 bg-gray-400 hover:bg-gray-500"
              size={"sm"}
            >
              Clear
            </Button>
            <Show />
          </div>
        )}
      </div>
      <div>
        {activeTab === "uploadFile" && <UploadFile />}
        {activeTab === "mediaLibrary" && <MediaLibrary click="delete" />}
      </div>
    </Card>
  );
};

export default Page;

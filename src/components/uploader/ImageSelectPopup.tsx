"use client";
import { useState } from "react";
import CommonModal from "../modal/CommonModal";
import MediaLibrary from "./MediaLibrary";
import UploadFile from "./UploadFile";
import { Button } from "../ui/button";

type TProps = {
  open: boolean;
  click?: string;
  handleOpen: (open: boolean) => void;
  modalTitle: string;
};
const ImageSelectPopup = ({ open, click, handleOpen, modalTitle }: TProps) => {
  const [activeTab, setActiveTab] = useState<string>("uploadFile");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <CommonModal
      open={open}
      handleOpen={handleOpen}
      modalTitle={modalTitle}
      className="w-[95%] h-[90%]"
    >
      <div className="flex flex-col gap-5 h-full">
        <div className="space-x-4">
          <Button
            onClick={() => handleTabClick("uploadFile")}
            className={`${
              activeTab === "uploadFile"
                ? "bg-primary text-white  hover:bg-secondary"
                : "border border-primary bg-inherit text-inherit hover:bg-inherit"
            }`}
          >
            Upload File
          </Button>
          <Button
            onClick={() => handleTabClick("mediaLibrary")}
            className={`${
              activeTab === "mediaLibrary"
                ? "bg-primary text-white  hover:bg-secondary"
                : "border border-primary bg-inherit text-inherit hover:bg-inherit"
            }`}
          >
            Media Library
          </Button>
        </div>
        <div className={`flex-1`}>
          {activeTab === "uploadFile" && <UploadFile />}
          {activeTab === "mediaLibrary" && (
            <MediaLibrary click={click} handleOpen={handleOpen} />
          )}
        </div>
      </div>
    </CommonModal>
  );
};

export default ImageSelectPopup;

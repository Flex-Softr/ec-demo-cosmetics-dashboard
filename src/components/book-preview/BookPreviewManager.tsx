"use client";
import Show from "@/components/Show";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BookPreviewLibrary from "@/components/book-preview/BookPreviewLibrary";
import UploadBookPreview from "@/components/book-preview/UploadBookPreview";

const BookPreviewManager = ({
  fixedType,
}: {
  fixedType?: "short" | "full" | "free";
}) => {
  const [activeTab, setActiveTab] = useState<string>("uploadFile");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            onClick={() => handleTabClick("uploadFile")}
            size="sm"
            type="button"
            className={`${
              activeTab === "uploadFile"
                ? "bg-primary text-white hover:bg-secondary"
                : "border border-primary bg-inherit text-inherit hover:bg-inherit"
            }`}
          >
            Upload PDF
          </Button>
          <Button
            onClick={() => handleTabClick("mediaLibrary")}
            size="sm"
            type="button"
            className={`${
              activeTab === "mediaLibrary"
                ? "bg-primary text-white hover:bg-secondary"
                : "border border-primary bg-inherit text-inherit hover:bg-inherit"
            }`}
          >
            Preview Library
          </Button>
        </div>
        {activeTab === "mediaLibrary" && (
          <div className="flex items-center gap-3">
            <Show />
          </div>
        )}
      </div>
      <div>
        {activeTab === "uploadFile" && (
          <UploadBookPreview fixedType={fixedType} />
        )}
        {activeTab === "mediaLibrary" && (
          <BookPreviewLibrary fixedType={fixedType} />
        )}
      </div>
    </div>
  );
};

export default BookPreviewManager;

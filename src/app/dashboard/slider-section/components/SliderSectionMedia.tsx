"use client";
import ImageSelectPopup from "@/components/uploader/ImageSelectPopup";
import { cn, formatImageSrc } from "@/lib/utils";
import { useGetSingleImageQuery } from "@/redux/features/addProduct/media/mediaApi";
import { useAppSelector } from "@/redux/hooks";
import { ImagePlus, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const SliderSectionMedia = () => {
  const [open, setOpen] = useState(false);
  const [click, setClick] = useState<string>("");
  const handleOpen = () => {
    setOpen(!open);
  };

  const { thumbnail } = useAppSelector(({ imageSelector }) => imageSelector);

  const { data: thumbnailImage } = useGetSingleImageQuery(
    thumbnail || undefined
  );

  return (
    <div className="w-full">
      <div
        onClick={() => {
          handleOpen();
          setClick("thumbnail");
        }}
        className={cn(
          "relative flex flex-col items-center justify-center w-full aspect-[3.2/1] rounded-lg border-2 border-dashed cursor-pointer transition-all duration-300 group overflow-hidden bg-background",
          thumbnail
            ? "border-primary/50 hover:border-primary"
            : "border-muted-foreground/25 hover:border-primary/30 hover:bg-muted/10"
        )}
      >
        {thumbnailImage?.data && thumbnail ? (
          <>
            <Image
              src={formatImageSrc(thumbnailImage.data.src)}
              alt={thumbnailImage.data.alt || "Thumbnail"}
              fill={true}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex flex-col items-center text-white">
                <ImagePlus className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Change Image</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center space-y-3">
            <div className="p-3 rounded-full bg-accent group-hover:bg-primary/10 transition-colors">
              <UploadCloud className="w-6 h-6 text-primary group-hover:text-primary/80 transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Click to upload image
              </p>
              <p className="text-xs text-muted-foreground">
                Recommended size: 1920 x 600 px
              </p>
            </div>
          </div>
        )}
      </div>

      <ImageSelectPopup
        open={open}
        click={click}
        handleOpen={handleOpen}
        modalTitle={`Add image for slider`}
      />
    </div>
  );
};

export default SliderSectionMedia;

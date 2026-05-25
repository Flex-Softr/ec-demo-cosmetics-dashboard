"use client";
import ImageSelectPopup from "@/components/uploader/ImageSelectPopup";
import { cn, formatImageSrc } from "@/lib/utils";
import { useGetSingleImageQuery } from "@/redux/features/addProduct/media/mediaApi";
import { useAppSelector } from "@/redux/hooks";
import { ImagePlus, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const CategoryFormImage = ({
  image,
}: {
  image?: { src: string; alt: string };
}) => {
  const [open, setOpen] = useState(false);
  const [click, setClick] = useState<string>("");
  const handleOpen = (value?: boolean) => {
    if (typeof value === "boolean") {
      setOpen(value);
    } else {
      setOpen((prev) => !prev);
    }
  };

  const { thumbnail } = useAppSelector(({ imageSelector }) => imageSelector);

  const { data: thumbnailImage } = useGetSingleImageQuery(
    thumbnail || undefined,
    { skip: !thumbnail }
  );

  const selectedImage =
    thumbnailImage?.data && thumbnail
      ? { src: thumbnailImage.data.src, alt: thumbnailImage.data.alt }
      : image?.src
        ? { src: image.src, alt: image.alt }
        : null;

  return (
    <div className="w-full">
      <div
        onClick={() => {
          handleOpen();
          setClick("thumbnail");
        }}
        className={cn(
          "relative flex flex-col items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-300 group overflow-hidden bg-background",
          thumbnail
            ? "border-primary/50 hover:border-primary"
            : "border-muted-foreground/25 hover:border-primary/30 hover:bg-muted/10"
        )}
      >
        {selectedImage ? (
          <>
            <Image
              src={formatImageSrc(selectedImage.src)}
              alt={selectedImage.alt || "Thumbnail"}
              fill={true}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex flex-col items-center text-white">
                <ImagePlus className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">Change</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-center space-y-2">
            <div className="p-2 rounded-full bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
              <UploadCloud className="w-5 h-5 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-foreground">Upload</p>
            </div>
          </div>
        )}
      </div>

      <ImageSelectPopup
        open={open}
        click={click}
        handleOpen={handleOpen}
        modalTitle={`Select Image`}
      />
    </div>
  );
};

export default CategoryFormImage;

"use client";
import { TypographyH4 } from "@/components/ui/Typography";
import ImageSelectPopup from "@/components/uploader/ImageSelectPopup";
import config from "@/config/config";
import { useGetSingleImageQuery } from "@/redux/features/addProduct/media/mediaApi";
import { useAppSelector } from "@/redux/hooks";
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
    <div className="grid grid-cols-1">
      <div className="flex flex-col justify-evenly">
        <div
          onClick={() => {
            handleOpen();
            setClick("thumbnail");
          }}
          className="flex flex-col items-center justify-center mx-auto mt-5 mb-3 bg-gray-200 w-96 object-contain h-40 border border-dotted  border-blue-gray-200 cursor-pointer relative rounded-sm"
        >
          {thumbnailImage?.data && thumbnail ? (
            <Image
              src={`${config.base_url}/${thumbnailImage.data.src}`}
              alt={thumbnailImage.data.alt || "Thumbnail"}
              fill={true}
              className="object-cover rounded-sm"
            />
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <TypographyH4 className="text-center">
                Recommended <br /> max 1080 * 451
              </TypographyH4>
            </>
          )}
        </div>
      </div>
      {/* modal
       */}
      <ImageSelectPopup
        open={open}
        click={click}
        handleOpen={handleOpen}
        modalTitle={`Add image for category ${click}`}
      />
    </div>
  );
};

export default SliderSectionMedia;

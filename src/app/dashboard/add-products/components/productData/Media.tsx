"use client";
import { TypographyH4 } from "@/components/ui/Typography";
import { SectionTitle } from "@/components/ui/sectionTitle";
import ImageSelectPopup from "@/components/uploader/ImageSelectPopup";
import { cn, formatImageSrc } from "@/lib/utils";
import { useGetSingleImageQuery } from "@/redux/features/addProduct/media/mediaApi";
import { useAppSelector } from "@/redux/hooks";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

type TProps = {
  isVariation?: boolean;
  index?: number;
};
const Media = ({ isVariation }: TProps) => {
  const [open, setOpen] = useState(false);
  const [click, setClick] = useState<string>("");
  const handleOpen = () => {
    setOpen(!open);
  };

  const {
    setValue,
    trigger,
    formState: { errors, submitCount },
  } = useFormContext();

  const { thumbnail, gallery } = useAppSelector(
    ({ imageSelector }) => imageSelector
  );

  // Sync Redux image state to Form State
  useEffect(() => {
    if (isVariation) {
      // Variation media logic is different?
      // The original code commented out variations usage (lines 26-28)
      // So assuming Media currently only supports main product media for now as per this component
    } else {
      if (thumbnail) {
        setValue("image.thumbnail", thumbnail, { shouldValidate: true });
        trigger("image.thumbnail");
      }
      if (gallery) {
        setValue("image.gallery", gallery, { shouldValidate: true });
        trigger("image.gallery");
      }
    }
  }, [thumbnail, gallery, setValue, isVariation, trigger]);

  // const image = useAppSelector(
  //   ({ productVariation }) => productVariation.variations[index || 0]?.image
  // );

  const { data: thumbnailImage } = useGetSingleImageQuery(
    thumbnail || undefined
  );
  const { data: galleryImage } = useGetSingleImageQuery(
    gallery[0] || undefined
  );

  const getError = (path: string) => {
    const parts = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = errors;
    for (const p of parts) {
      if (current?.[p]) current = current[p];
      else return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (current as any)?.message as string | undefined;
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col justify-evenly">
          <SectionTitle
            className="text-center border-primary cursor-help"
            title="Upload a representative image for the product."
          >
            Add Thumbnail
          </SectionTitle>
          <div
            onClick={() => {
              handleOpen();
              setClick(isVariation ? "variation" : "thumbnail");
            }}
            className={cn(
              "relative flex flex-col items-center justify-center mx-auto mt-5 w-48 h-48 aspect-[3.2/1] rounded-lg border-2 border-dashed cursor-pointer transition-all duration-300 group overflow-hidden bg-background",
              // default / hover state
              !getError("image.thumbnail") &&
                "border-muted-foreground/25 hover:border-primary/30 hover:bg-muted/10",
              // error state
              // getError("image.thumbnail") &&
              //   "border-primary/50 hover:border-primary",
              // submit error override (highest priority)
              submitCount > 0 && getError("image.thumbnail") && "border-red-500"
            )}
          >
            {thumbnailImage?.data?.src && thumbnail ? (
              <Image
                src={formatImageSrc(thumbnailImage.data.src)}
                alt={thumbnailImage.data.alt || "Thumbnail"}
                fill={true}
                className="object-cover rounded-sm"
                sizes="(max-width: 208px) 100vw,"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center space-y-3">
                <div className="p-3 rounded-full bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                  <UploadCloud className="w-6 h-6 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Click to upload image
                  </p>
                  <TypographyH4 className="!text-[10px] text-muted-foreground font-normal">
                    Recommended: 800 × 800 px
                  </TypographyH4>
                </div>
              </div>
            )}
          </div>
          {submitCount > 0 && getError("image.thumbnail") && (
            <p className="text-red-500 text-center mt-2">
              {getError("image.thumbnail")}
            </p>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <SectionTitle
            className="text-center border-primary cursor-help"
            title="Upload additional images for the product gallery."
          >
            Image Gallery
          </SectionTitle>
          <div
            onClick={() => {
              handleOpen();
              setClick("gallery");
            }}
            className={cn(
              "relative flex flex-col items-center justify-center mx-auto mt-5 w-48 h-48 aspect-[3.2/1] rounded-lg border-2 border-dashed cursor-pointer transition-all duration-300 group overflow-hidden bg-background",

              // default / hover state
              !getError("image.gallery") &&
                "border-muted-foreground/25 hover:border-primary/30 hover:bg-muted/10",

              // error state
              // getError("image.gallery") &&
              //   "border-primary/50 hover:border-primary",

              // submit error override (highest priority)
              submitCount > 0 && getError("image.gallery") && "border-red-500"
            )}
          >
            {galleryImage?.data?.src && gallery.length ? (
              <>
                <Image
                  src={formatImageSrc(galleryImage.data.src)}
                  alt={galleryImage.data.alt || "Gallery"}
                  fill={true}
                  className="object-cover rounded-sm"
                  sizes="(max-width: 208px) 100vw,"
                />
                <span className="text-white text-4xl absolute mx-auto my-auto group-hover:bg-white group-hover:text-gray-600 group-hover:opacity-70 h-10 w-10 text-center items-center rounded-full">
                  {gallery.length}
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-center space-y-3">
                <div className="p-3 rounded-full bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                  <UploadCloud className="w-6 h-6 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Click to upload image
                  </p>
                  <TypographyH4 className="!text-[10px] text-muted-foreground font-normal">
                    Recommended: 800 × 800 px
                  </TypographyH4>
                </div>
              </div>
            )}
          </div>
          {submitCount > 0 && getError("image.gallery") && (
            <p className="text-red-500 text-center mt-2">
              {getError("image.gallery")}
            </p>
          )}
        </div>
        {/* modal
         */}
        <ImageSelectPopup
          open={open}
          click={click}
          handleOpen={handleOpen}
          modalTitle={`Add image for ${click}`}
        />
      </div>
    </>
  );
};

export default Media;

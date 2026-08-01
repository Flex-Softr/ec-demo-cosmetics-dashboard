"use client";
import { TypographyH4 } from "@/components/ui/Typography";
import { SectionTitle } from "@/components/ui/sectionTitle";
import ImageSelectPopup from "@/components/uploader/ImageSelectPopup";
import { cn, formatImageSrc } from "@/lib/utils";
import { useGetSingleImageQuery } from "@/redux/features/addProduct/media/mediaApi";
import { setGallery } from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppSelector } from "@/redux/hooks";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useAppDispatch } from "@/redux/hooks";

type TProps = {
  isVariation?: boolean;
  index?: number;
};
const Media = ({ isVariation }: TProps) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [click, setClick] = useState<string>("");
  const handleOpen = () => {
    setOpen(!open);
  };

  const {
    setValue,
    trigger,
    clearErrors,
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

  const handleClearGallery = () => {
    dispatch(setGallery([]));
    setValue("image.gallery", [], { shouldValidate: true, shouldDirty: true });
    clearErrors("image.gallery");
    trigger("image.gallery");
  };

  // const image = useAppSelector(
  //   ({ productVariation }) => productVariation.variations[index || 0]?.image
  // );

  const { data: thumbnailImage } = useGetSingleImageQuery(
    thumbnail || undefined,
    { skip: !thumbnail }
  );
  const { data: galleryImage } = useGetSingleImageQuery(
    gallery[0] || undefined,
    { skip: !gallery.length }
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
              "relative mx-auto mt-4 flex h-32 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-background transition-all duration-300 cursor-pointer group",
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
                className="rounded-sm object-cover"
                sizes="128px"
              />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-1.5 p-2 text-center">
                <div className="rounded-full bg-accent p-1.5 transition-colors group-hover:bg-primary/10">
                  <UploadCloud className="h-3.5 w-3.5 text-primary transition-colors group-hover:text-primary/80" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold leading-tight text-foreground">
                    Click to upload
                  </p>
                  <TypographyH4 className="!text-[9px] font-normal text-muted-foreground">
                    800 × 800 px
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
              "relative mx-auto mt-4 flex h-32 w-32 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-background transition-all duration-300 cursor-pointer group",

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
                  className="rounded-sm object-cover"
                  sizes="128px"
                />
                <button
                  type="button"
                  aria-label="Clear gallery images"
                  title="Clear gallery images"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearGallery();
                  }}
                  className="absolute right-1.5 top-1.5 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition hover:bg-white hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <span className="absolute mx-auto my-auto flex h-8 w-8 items-center justify-center rounded-full text-center text-2xl text-white group-hover:bg-white group-hover:text-gray-600 group-hover:opacity-70">
                  {gallery.length}
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-1.5 p-2 text-center">
                <div className="rounded-full bg-accent p-1.5 transition-colors group-hover:bg-primary/10">
                  <UploadCloud className="h-3.5 w-3.5 text-primary transition-colors group-hover:text-primary/80" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold leading-tight text-foreground">
                    Click to upload
                  </p>
                  <TypographyH4 className="!text-[9px] font-normal text-muted-foreground">
                    800 × 800 px
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
          purpose="product"
        />
      </div>
    </>
  );
};

export default Media;

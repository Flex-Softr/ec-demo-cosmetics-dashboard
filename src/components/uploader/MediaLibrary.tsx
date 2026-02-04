// import { setVariationThumbnail } from "@/redux/features/addProduct/variation/variationSlice";
import { useToast } from "@/components/ui/use-toast";
import { formatImageSrc } from "@/lib/utils";
import {
  useDeleteImageMutation,
  useGetImagesQuery,
} from "@/redux/features/imageSelector/imageApi";
import {
  setDeleteImage,
  setGallery,
  setThumbnail,
} from "@/redux/features/imageSelector/imageSelectorSlice";
import {
  setIsLoading,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { CheckIcon } from "@radix-ui/react-icons";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import CommonModal from "../modal/CommonModal";
import { PagePagination } from "../pagination/PagePagination";
import { Button } from "../ui/button";
import ImageDetails, { TMediaImage } from "./ImageDetails";

// type TImage = { _id: string; src: string; alt: string };
type TProps = {
  click?: string;
  index?: number;
  handleOpen?: (open: boolean) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MediaLibrary = ({ click, index, handleOpen }: TProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [deleteImage, { isLoading: loading }] = useDeleteImageMutation();

  const { thumbnail, gallery, deleteImages } = useAppSelector(
    ({ imageSelector }) => imageSelector
  );

  // Local state for handling selections
  const [localThumbnail, setLocalThumbnail] = useState<string>(thumbnail);
  const [localGallery, setLocalGallery] = useState<string[]>(gallery);
  const [localDeleteImages, setLocalDeleteImages] =
    useState<string[]>(deleteImages);

  const selectImage = (imageId: string) => {
    if (click === "thumbnail") {
      if (localThumbnail === imageId) {
        setLocalThumbnail("");
      } else {
        setLocalThumbnail(imageId);
      }
    }
    if (click === "gallery") {
      if (localGallery.includes(imageId)) {
        const restItem = localGallery.filter(
          (item: string) => item !== imageId
        );
        setLocalGallery(restItem);
      } else if (localGallery.length === 5) {
        alert("You can select maximum 5 gallery images");
      } else {
        setLocalGallery([...localGallery, imageId]);
      }
    }
    if (click === "delete") {
      if (localDeleteImages.includes(imageId)) {
        const restItem = localDeleteImages.filter(
          (item: string) => item !== imageId
        );
        setLocalDeleteImages(restItem);
      } else if (localDeleteImages.length === 50) {
        alert("You can select maximum 50 images");
      } else {
        setLocalDeleteImages([...localDeleteImages, imageId]);
      }
    }
  };

  const handleDone = () => {
    if (click === "thumbnail") {
      dispatch(setThumbnail(localThumbnail));
    } else if (click === "gallery") {
      dispatch(setGallery(localGallery));
    }

    if (handleOpen) {
      handleOpen(false);
    }
  };

  const { page, limit } = useAppSelector(({ pagination }) => pagination);

  const { data, isLoading, error } = useGetImagesQuery({
    page,
    limit,
    sort: "-createdAt",
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(setIsLoading(true));
    }
    if (data) {
      const { meta } = data;
      dispatch(setTotalPage(meta));
      dispatch(setIsLoading(false));
    }
    if (error) {
      throw new Error("Something went wrong!");
    }
  }, [data, error, isLoading, dispatch]);

  const handleDelete = async () => {
    try {
      if (!localDeleteImages.length) {
        alert("Please select images.");
        return;
      } else {
        alert("Are you sure to delete the images?");
      }
      const res = await deleteImage(localDeleteImages).unwrap();
      if (!res.error) {
        setLocalDeleteImages([]);
        dispatch(setDeleteImage([])); // Clean global state as well if needed
      }
      toast({
        className: "bg-success text-white text-2xl",
        title: "Images deleted successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Images delete is failed!",
        description: "Something went wrong.",
      });
    }
  };

  // State for image details modal
  const [selectedImage, setSelectedImage] = useState<TMediaImage | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const showImageDetails = (image: TMediaImage) => {
    setSelectedImage(image);
    setDetailsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col h-full relative">
        <div className="flex flex-wrap gap-4 p-2 h-full border border-gray-300">
          {/* {click === "thumbnail" || click === "variation" */}
          {click === "thumbnail"
            ? data?.data?.map((image: TMediaImage) => (
                <div
                  key={image._id}
                  onClick={() => selectImage(image._id)}
                  className={`w-[140px] h-[140px] relative cursor-pointer rounded-sm ${localThumbnail === image._id && "border-2 border-blue-600"}`}
                >
                  <Image
                    src={formatImageSrc(image.src)}
                    alt={image.alt}
                    fill={true}
                    className="object-cover rounded-sm"
                    sizes="(max-width: 208px) 100vw,"
                  />
                  {localThumbnail === image._id && (
                    <button className="bg-white text-green-500 absolute right-1 bottom-1 p-1 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10">
                      {/* <Cross2Icon className="h-5 w-5" /> */}
                      <CheckIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))
            : data?.data?.map((image: TMediaImage) => (
                <div
                  key={image._id}
                  onClick={() => selectImage(image._id)}
                  className={`w-[140px] h-[140px] relative cursor-pointer rounded-sm ${
                    (localGallery.includes(image._id) ||
                      localDeleteImages.includes(image._id)) &&
                    "border-2 border-blue-600"
                  }`}
                >
                  <Image
                    src={formatImageSrc(image.src)}
                    alt={image.alt}
                    fill={true}
                    className="object-cover rounded-sm"
                    sizes="(max-width: 208px) 100vw,"
                  />
                  <span title="View image">
                    <EyeIcon
                      className="h-6 w-6 bg-white text-green-500 absolute right-1 top-1 p-1 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
                      onClick={(e) => {
                        showImageDetails(image);
                        e.stopPropagation();
                      }}
                    />
                  </span>

                  {(localGallery.includes(image._id) ||
                    localDeleteImages.includes(image._id)) && (
                    <button className="bg-white text-green-500 absolute right-1 bottom-1 p-1 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10">
                      {/* <Cross2Icon className="h-5 w-5" /> */}
                      <CheckIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
        </div>
        <div className="flex items-center justify-end space-x-2 h-20">
          {data?.meta?.totalPage > 1 && <PagePagination />}
          <div className="flex justify-end">
            <Button
              onClick={() =>
                click === "delete" ? handleDelete() : handleDone()
              }
              disabled={loading}
            >
              {click === "delete" ? "Delete" : "Done"}
            </Button>
          </div>
        </div>
      </div>
      <CommonModal
        open={detailsModalOpen}
        handleOpen={setDetailsModalOpen}
        modalTitle="Image Details"
        className="w-[1000px] h-[850px]"
      >
        {selectedImage && (
          <ImageDetails
            image={selectedImage}
            onDeleteSuccess={() => setDetailsModalOpen(false)}
          />
        )}
      </CommonModal>
    </>
  );
};

export default MediaLibrary;

import config from "@/config/config";
// import { setVariationThumbnail } from "@/redux/features/addProduct/variation/variationSlice";
import {
  setDeleteImage,
  setGallery,
  setThumbnail,
} from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { CheckIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { PagePagination } from "../pagination/PagePagination";
import { useGetImagesQuery } from "@/redux/features/imageSelector/imageApi";
import { Button } from "../ui/button";
import {
  setIsLoading,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { useEffect } from "react";
import { useDeleteImageMutation } from "@/redux/features/imageSelector/imageApi";
import { useToast } from "@/components/ui/use-toast";
import { EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type TImage = { _id: string; src: string; alt: string };
type TProps = {
  click?: string;
  index?: number;
  handleOpen?: (open: boolean) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MediaLibrary = ({ click, index, handleOpen }: TProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  const [deleteImage, { isLoading: loading }] = useDeleteImageMutation();

  const { thumbnail, gallery, deleteImages } = useAppSelector(
    ({ imageSelector }) => imageSelector
  );

  // const image = useAppSelector(
  //   ({ productVariation }) =>
  //     productVariation.variations[index || 0]?.image || {}
  // );

  const selectImage = (imageId: string) => {
    if (click === "thumbnail") {
      if (thumbnail === imageId) {
        dispatch(setThumbnail(""));
      } else {
        dispatch(setThumbnail(imageId));
      }
    }
    // if (click === "variation") {
    //   if (thumbnail === imageId) {
    //     dispatch(setVariationThumbnail({ index: 0, image: "" }));
    //   } else {
    //     dispatch(setVariationThumbnail({ index: 0, image: imageId }));
    //   }
    // }
    if (click === "gallery") {
      if (gallery.includes(imageId)) {
        const restItem = gallery.filter((item: string) => item !== imageId);
        dispatch(setGallery(restItem));
      } else if (gallery.length === 5) {
        alert("You can select maximum 5 gallery images");
      } else {
        dispatch(setGallery([...gallery, imageId]));
      }
    }
    if (click === "delete") {
      if (deleteImages.includes(imageId)) {
        const restItem = deleteImages.filter(
          (item: string) => item !== imageId
        );
        dispatch(setDeleteImage(restItem));
      } else if (deleteImages.length === 50) {
        alert("You can select maximum 50 images");
      } else {
        dispatch(setDeleteImage([...deleteImages, imageId]));
      }
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
      if (!deleteImages.length) {
        alert("Please select images.");
        return;
      } else {
        alert("Are you sure to delete the images?");
      }
      const res = await deleteImage(deleteImages).unwrap();
      if (!res.error) {
        dispatch(setDeleteImage([]));
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

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex flex-wrap gap-4 p-2 h-full border border-gray-300">
        {/* {click === "thumbnail" || click === "variation" */}
        {click === "thumbnail"
          ? data?.data?.map((image: TImage) => (
              <div
                key={image._id}
                onClick={() => selectImage(image._id)}
                className={`w-[140px] h-[140px] relative cursor-pointer rounded-sm ${thumbnail === image._id && "border-2 border-blue-600"}`}
              >
                <Image
                  src={`${config.base_url}/${image.src}`}
                  alt={image.alt}
                  fill={true}
                  className="object-cover rounded-sm"
                  sizes="(max-width: 208px) 100vw,"
                />
                {thumbnail === image._id && (
                  <button className="bg-white text-green-500 absolute right-1 bottom-1 p-1 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10">
                    {/* <Cross2Icon className="h-5 w-5" /> */}
                    <CheckIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))
          : data?.data?.map((image: TImage) => (
              <div
                key={image._id}
                onClick={() => selectImage(image._id)}
                className={`w-[140px] h-[140px] relative cursor-pointer rounded-sm ${
                  (gallery.includes(image._id) ||
                    deleteImages.includes(image._id)) &&
                  "border-2 border-blue-600"
                }`}
              >
                <Image
                  src={`${config.base_url}/${image.src}`}
                  alt={image.alt}
                  fill={true}
                  className="object-cover rounded-sm"
                  sizes="(max-width: 208px) 100vw,"
                />
                <span title="View image">
                  <EyeIcon
                    className="h-6 w-6 bg-white text-green-500 absolute right-1 top-1 p-1 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
                    onClick={(e) => {
                      router.push(`/dashboard/media/${image._id}`);
                      e.stopPropagation();
                    }}
                  />
                </span>

                {(gallery.includes(image._id) ||
                  deleteImages.includes(image._id)) && (
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
            onClick={() => (handleOpen ? handleOpen(false) : handleDelete())}
            disabled={loading}
          >
            {click === "delete" ? "Delete" : "Done"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;

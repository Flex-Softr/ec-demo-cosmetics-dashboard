// import { setVariationThumbnail } from "@/redux/features/addProduct/variation/variationSlice";
import { useToast } from "@/components/ui/use-toast";
import { formatImageSrc, decodeUTF8 } from "@/lib/utils";
import {
  useDeleteImageMutation,
  useGetImagesQuery,
} from "@/redux/features/imageSelector/imageApi";
import {
  setDeleteImage,
  setGallery,
  setThumbnail,
} from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { CheckIcon } from "@radix-ui/react-icons";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import CommonAlertDialog from "../common/CommonAlertDialog";
import CommonModal from "../modal/CommonModal";
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

  // ── Local pagination state (isolated from the global Redux pagination) ──
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPageLocal] = useState(0);
  const [total, setTotal] = useState(0);

  // Sync local delete selection when Redux state is cleared externally (e.g. Clear button)
  useEffect(() => {
    setLocalDeleteImages(deleteImages);
  }, [deleteImages]);

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

  const { data, isLoading, error } = useGetImagesQuery({
    page,
    limit,
    sort: "-createdAt",
  });

  useEffect(() => {
    if (data) {
      const { meta } = data;
      setTotalPageLocal(meta?.totalPage ?? 0);
      setTotal(meta?.total ?? 0);
    }
    if (error) {
      throw new Error("Something went wrong!");
    }
  }, [data, error]);

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const handleDelete = () => {
    if (!localDeleteImages.length) {
      toast({
        variant: "destructive",
        title: "No images selected",
        description: "Please select at least one image to delete.",
      });
      return;
    }
    setDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteImage(localDeleteImages).unwrap();
      if (!res.error) {
        setLocalDeleteImages([]);
        dispatch(setDeleteImage([]));
      }
      toast({
        className: "bg-success text-white text-2xl",
        title: "Images deleted successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Images delete failed!",
        description: "Something went wrong.",
      });
    } finally {
      setDeleteAlertOpen(false);
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
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 p-2 h-full border border-gray-300 overflow-y-auto">
          {/* {click === "thumbnail" || click === "variation" */}
          {click === "thumbnail"
            ? data?.data?.map((image: TMediaImage) => (
                <div
                  key={image._id}
                  onClick={() => selectImage(image._id)}
                  className={`border w-full aspect-square relative cursor-pointer rounded-sm ${localThumbnail === image._id && "border-2 border-blue-600"}`}
                >
                  <Image
                    src={formatImageSrc(image.src)}
                    alt={decodeUTF8(image.alt)}
                    fill={true}
                    className="object-contain rounded-sm"
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
                  className={`w-full border aspect-square relative cursor-pointer rounded-sm ${
                    (localGallery.includes(image._id) ||
                      localDeleteImages.includes(image._id)) &&
                    "border-2 border-blue-600"
                  }`}
                >
                  <Image
                    src={formatImageSrc(image.src)}
                    alt={decodeUTF8(image.alt)}
                    fill={true}
                    className="object-contain rounded-sm"
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
          {totalPage > 1 && (
            <LocalPagination
              page={page}
              totalPage={totalPage}
              total={total}
              limit={limit}
              isLoading={isLoading}
              onPageChange={setPage}
            />
          )}
          <div className="flex justify-end">
            <Button
              onClick={() =>
                click === "delete" ? handleDelete() : handleDone()
              }
              size="sm"
              disabled={loading}
              variant={click === "delete" ? "destructive" : "default"}
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
        className="w-full max-w-4xl max-h-screen"
      >
        {selectedImage && (
          <ImageDetails
            image={selectedImage}
            onDeleteSuccess={() => setDetailsModalOpen(false)}
          />
        )}
      </CommonModal>
      <CommonAlertDialog
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        title="Delete Images"
        description={`Are you sure you want to delete ${localDeleteImages.length} selected image${localDeleteImages.length > 1 ? "s" : ""}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        loading={loading}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

// ─────────────────────────────────────────────
// Inline pagination component (local state only)
// ─────────────────────────────────────────────
type LocalPaginationProps = {
  page: number;
  totalPage: number;
  total: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
};

function LocalPagination({
  page: currentPage,
  totalPage,
  total,
  limit,
  isLoading,
  onPageChange,
}: LocalPaginationProps) {
  const pages = [...Array(totalPage)].map((_, i) => i + 1);

  let displayPages: (number | string)[];
  if (totalPage <= 5) {
    displayPages = pages;
  } else {
    const left = Math.max(0, currentPage - 2);
    const right = Math.min(totalPage - 1, currentPage);
    if (currentPage - 1 > 2) {
      displayPages = ([1, "..."] as (number | string)[]).concat(
        pages.slice(left, right + 1)
      );
    } else {
      displayPages = pages.slice(0, right + 1);
    }
    if (currentPage + 1 < totalPage - 1) {
      displayPages = displayPages.concat(["...", totalPage]);
    } else {
      displayPages = displayPages.concat(pages.slice(right + 1));
    }
  }

  const showFrom = currentPage * limit - limit;

  return (
    <div className="flex items-center gap-1 text-sm flex-wrap">
      <span className="mr-4 whitespace-nowrap text-muted-foreground">
        {total !== 0 ? showFrom + 1 : showFrom}–
        {currentPage * limit < total ? currentPage * limit : total} of {total}
      </span>
      <button
        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isLoading || currentPage === 1}
      >
        ‹
      </button>
      {displayPages.map((item, i) => (
        <button
          key={i}
          onClick={() => typeof item === "number" && onPageChange(item)}
          disabled={isLoading || item === "..."}
          className={`px-2 py-1 rounded ${
            currentPage === item
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200"
          } disabled:opacity-40`}
        >
          {item}
        </button>
      ))}
      <button
        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLoading || currentPage === totalPage}
      >
        ›
      </button>
    </div>
  );
}

export default MediaLibrary;

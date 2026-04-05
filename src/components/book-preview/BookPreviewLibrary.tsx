import { useToast } from "@/components/ui/use-toast";
import { formatImageSrc, decodeUTF8 } from "@/lib/utils";
import {
  useDeleteBookPreviewMutation,
  useGetBookPreviewsQuery,
} from "@/redux/features/bookPreview/bookPreviewApi";
import {
  setIsLoading,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  CheckIcon,
  FileTextIcon,
  CopyIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import CommonAlertDialog from "../common/CommonAlertDialog";
import CommonModal from "../modal/CommonModal";
import { PagePagination } from "../pagination/PagePagination";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { setPage } from "@/redux/features/pagination/PaginationSlice";

type TBookPreviewItem = { _id: string; src: string; alt: string };

const BookPreviewLibrary = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [deleteBookPreview, { isLoading: loading }] =
    useDeleteBookPreviewMutation();

  const [localDeleteItems, setLocalDeleteItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const selectItem = (itemId: string) => {
    if (localDeleteItems.includes(itemId)) {
      const restItem = localDeleteItems.filter(
        (item: string) => item !== itemId
      );
      setLocalDeleteItems(restItem);
    } else if (localDeleteItems.length === 50) {
      alert("You can select maximum 50 files");
    } else {
      setLocalDeleteItems([...localDeleteItems, itemId]);
    }
  };

  const { page, limit } = useAppSelector(({ pagination }) => pagination);

  useEffect(() => {
    dispatch(setPage(1));
  }, [debouncedSearchTerm, dispatch]);

  const { data, isLoading, error } = useGetBookPreviewsQuery({
    page,
    limit,
    sort: "-createdAt",
    search: debouncedSearchTerm,
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
      toast({
        variant: "destructive",
        title: "Failed to fetch book previews",
      });
    }
  }, [data, error, isLoading, dispatch, toast]);

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<TBookPreviewItem | null>(
    null
  );

  const handleDelete = () => {
    if (!localDeleteItems.length) {
      toast({
        variant: "destructive",
        title: "No previews selected",
        description: "Please select at least one preview to delete.",
      });
      return;
    }
    setDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteBookPreview(localDeleteItems).unwrap();
      if (!res.error) {
        setLocalDeleteItems([]);
      }
      toast({
        className: "bg-success text-white text-2xl",
        title: "Book Previews deleted successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed!",
        description: "Something went wrong.",
      });
    } finally {
      setDeleteAlertOpen(false);
    }
  };

  const handleCopyLink = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    toast({
      className: "bg-success text-white text-2xl",
      title: "Link Copied!",
      description: "Preview link copied to clipboard.",
    });
  };

  const handlePreview = (e: React.MouseEvent, item: TBookPreviewItem) => {
    e.stopPropagation();
    setCurrentPreview(item);
    setPreviewModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col h-full relative">
        <div className="mb-3 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 min-w-fit">
              {localDeleteItems.length} selected
            </div>
            <Input
              placeholder="Search by name..."
              className="h-9 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setLocalDeleteItems([])}
              variant="outline"
              size="sm"
              disabled={!localDeleteItems.length}
            >
              Clear Selection
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              size="sm"
              disabled={!localDeleteItems.length || loading}
            >
              Delete Selected
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 p-4 h-full border border-gray-300 overflow-y-auto bg-gray-50/50 rounded-md min-h-[400px]">
          {data?.data?.map((item: TBookPreviewItem) => (
            <div
              key={item._id}
              onClick={() => selectItem(item._id)}
              className={`w-full h-[150px] bg-white border flex flex-col items-center justify-center relative cursor-pointer rounded-md shadow-sm transition-all hover:shadow-md ${
                localDeleteItems.includes(item._id) && "border-2 border-primary"
              }`}
            >
              <FileTextIcon className="h-10 w-10 text-primary mb-2" />
              <span
                className="text-xs text-center break-words w-full truncate px-2 text-gray-700"
                title={decodeUTF8(item.alt)}
              >
                {decodeUTF8(item.alt)}
              </span>

              <div className="flex gap-1 absolute right-2 top-2 z-10">
                <span title="Preview PDF">
                  <EyeOpenIcon
                    className="h-7 w-7 bg-white/80 backdrop-blur-sm opacity-60 text-primary border p-1.5 rounded-md transition-all hover:opacity-100 hover:bg-white hover:shadow-sm cursor-pointer"
                    onClick={(e) => handlePreview(e, item)}
                  />
                </span>
                <span title="Copy Link">
                  <CopyIcon
                    className="h-7 w-7 bg-white/80 backdrop-blur-sm opacity-60 text-primary border p-1.5 rounded-md transition-all hover:opacity-100 hover:bg-white hover:shadow-sm cursor-pointer"
                    onClick={(e) => handleCopyLink(e, formatImageSrc(item.src))}
                  />
                </span>
              </div>

              {localDeleteItems.includes(item._id) && (
                <div className="bg-primary text-white absolute left-2 top-2 p-0.5 rounded-full z-10">
                  <CheckIcon className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {data?.data?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-500 py-10">
              <FileTextIcon className="h-12 w-12 mb-2 opacity-20" />
              <p>No book previews found</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-2 h-20">
          {data?.meta?.totalPage > 1 && <PagePagination />}
        </div>
      </div>

      <CommonAlertDialog
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        title="Delete Book Previews"
        description={`Are you sure you want to delete ${
          localDeleteItems.length
        } selected preview${
          localDeleteItems.length > 1 ? "s" : ""
        }? This action cannot be undone.`}
        onConfirm={confirmDelete}
        loading={loading}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <CommonModal
        open={previewModalOpen}
        handleOpen={setPreviewModalOpen}
        modalTitle={`Preview: ${decodeUTF8(currentPreview?.alt)}`}
        className="max-w-[98vw] md:max-w-6xl max-h-[95vh]"
      >
        <div className="w-full h-[85vh] bg-gray-100 rounded-md overflow-hidden">
          {currentPreview && (
            <iframe
              src={`${formatImageSrc(currentPreview.src)}#toolbar=0`}
              className="w-full h-full border-none"
              title={decodeUTF8(currentPreview.alt)}
            />
          )}
        </div>
      </CommonModal>
    </>
  );
};

export default BookPreviewLibrary;

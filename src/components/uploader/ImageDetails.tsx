"use client";
import CommonAlertDialog from "@/components/common/CommonAlertDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatImageSrc } from "@/lib/utils";
import { useDeleteImageMutation } from "@/redux/features/imageSelector/imageApi";
import { Check, Copy, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export type TMediaImage = { _id: string; src: string; alt: string };

const ImageDetails = ({
  image,
  onDeleteSuccess,
}: {
  image: TMediaImage;
  onDeleteSuccess?: () => void;
}) => {
  const { toast } = useToast();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteImageMutation();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    const url = formatImageSrc(image.src);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        className: "bg-success text-white",
        title: "URL copied to clipboard!",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ variant: "destructive", title: "Failed to copy URL" });
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteImage([image._id]).unwrap();
      if (res.success) {
        toast({
          className: "bg-success text-white text-2xl",
          title: "Image deleted successfully!",
        });
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete image",
      });
    } finally {
      setDeleteAlertOpen(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative w-full h-[80vh] bg-gray-100 rounded-sm overflow-hidden">
        <Image
          src={formatImageSrc(image.src)}
          alt={image.alt}
          fill
          className="rounded-sm object-contain"
          sizes="(max-width: 900px) 100vw, 900px"
          priority
        />
      </div>
      <div className="flex items-center justify-between w-full mt-4 pb-2 gap-2">
        <Button
          variant="outline"
          onClick={handleCopyUrl}
          className="flex items-center gap-2"
        >
          {copied ? (
            <Check className="w-4 h-4 text-success" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? "Copied!" : "Copy URL"}
        </Button>
        <Button
          variant="destructive"
          onClick={() => setDeleteAlertOpen(true)}
          disabled={isDeleting}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Image
        </Button>
      </div>
      <CommonAlertDialog
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        title="Delete Image"
        description="Are you sure you want to delete this image? This action cannot be undone."
        onConfirm={confirmDelete}
        loading={isDeleting}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ImageDetails;

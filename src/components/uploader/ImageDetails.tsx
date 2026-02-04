"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatImageSrc } from "@/lib/utils";
import { useDeleteImageMutation } from "@/redux/features/imageSelector/imageApi";
import { Trash2 } from "lucide-react";
import Image from "next/image";

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

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this image?"
      );
      if (!confirmDelete) return;

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
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative w-full h-[750px] bg-gray-100 rounded-sm overflow-hidden">
        <Image
          src={formatImageSrc(image.src)}
          alt={image.alt}
          fill
          className="rounded-sm object-contain"
          sizes="(max-width: 900px) 100vw, 900px"
          priority
        />
      </div>
      <div className="flex justify-end w-full mt-4 pb-2">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Image
        </Button>
      </div>
    </div>
  );
};

export default ImageDetails;

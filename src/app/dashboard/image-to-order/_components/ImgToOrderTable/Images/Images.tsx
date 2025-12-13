"use client";
import CommonModal from "@/components/modal/CommonModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const Images = ({ images }: { images: string[] }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const galleryImages = images?.map((file) => ({
    original: file,
    thumbnail: file,
    crossOrigin: "anonymous",
  }));

  return (
    <div>
      <Button
        onClick={handleOpen}
        className="bg-inherit text-inherit hover:bg-inherit"
      >
        View
      </Button>
      <CommonModal
        open={open}
        handleOpen={handleOpen}
        className="h-[80vh] w-11/12"
        modalTitle="Videos and images"
      >
        <div>
          {images?.length ? (
            <>
              <h2 className="font-bold py-2 text-slate-700">Images:</h2>
              <ImageGallery
                items={galleryImages}
                lazyLoad
                showNav={false}
                autoPlay // TODO: enable this
                // infinite //TODO: enable this
              />
            </>
          ) : (
            <>
              <p>No image to order found</p>
            </>
          )}
        </div>
      </CommonModal>
    </div>
  );
};

export default Images;

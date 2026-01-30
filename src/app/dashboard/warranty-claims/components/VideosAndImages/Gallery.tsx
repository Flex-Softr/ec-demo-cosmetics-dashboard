"use client";
import { formatImageSrc } from "@/lib/utils";
import { TVideosAndImages } from "@/redux/features/warrantyClaimRequests/warrantyClaimInterface";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const Gallery = ({
  videosAndImages,
}: {
  videosAndImages: TVideosAndImages[];
}) => {
  const galleryImages = videosAndImages?.map((file) => ({
    original: `${formatImageSrc(file?.path)}`,
    thumbnail: `${formatImageSrc(file?.path)}`,
    crossOrigin: "anonymous",
  }));

  return (
    <>
      <ImageGallery
        items={galleryImages}
        lazyLoad
        showNav={false}
        // autoPlay // TODO: enable this
        // infinite //TODO: enable this
      />
    </>
  );
};

export default Gallery;

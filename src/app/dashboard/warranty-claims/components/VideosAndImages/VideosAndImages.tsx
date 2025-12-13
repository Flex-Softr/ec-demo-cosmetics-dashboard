"use client";
import CommonModal from "@/components/modal/CommonModal";
import { Button } from "@/components/ui/button";
import { TWarrantyClaim } from "@/redux/features/warrantyClaimRequests/warrantyClaimInterface";
import { useState } from "react";
import Gallery from "./Gallery";
import VideoGallery from "./VideoGallery";
const VideosAndImages = ({ reqData }: { reqData: TWarrantyClaim }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };
  const images = reqData.videosAndImages.filter(
    (item) => item.fileType === "image"
  );
  const videos = reqData.videosAndImages.filter(
    (item) => item.fileType === "video"
  );
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
          {images ? (
            <>
              <h2 className="font-bold py-2 text-slate-700">Images:</h2>
              <Gallery videosAndImages={images} />
            </>
          ) : null}
        </div>

        <div>
          {videos ? (
            <>
              <h2 className="font-bold py-2 text-slate-700">Videos:</h2>
              <VideoGallery videos={videos} />
            </>
          ) : null}
        </div>
      </CommonModal>
    </div>
  );
};

export default VideosAndImages;

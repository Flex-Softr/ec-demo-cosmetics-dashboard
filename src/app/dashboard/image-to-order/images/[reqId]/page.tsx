"use client";

import { Card } from "@/components/ui/card";
import { useGetSingleImageToOrderReqQuery } from "@/redux/features/imageToOrder/imageToOrderApi";
import { TImageToOrderReq } from "@/redux/features/imageToOrder/imageToOrderInterface";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const ImageViewingPage = ({ params }: { params: { reqId: string } }) => {
  const { data, isLoading } = useGetSingleImageToOrderReqQuery({
    id: params.reqId,
  });

  const reqData = (data?.data ?? {}) as TImageToOrderReq;

  let isAvailable = true;
  if (!Object.keys(reqData).length) isAvailable = false;

  const galleryImages = reqData.images?.map((file) => ({
    original: file,
    thumbnail: file,
    crossOrigin: "anonymous",
  }));

  return (
    <Card className="p-4 shadow-none rounded-xl m-3">
      <h2 className="text-xl font-bold mb-2">Request ID: {reqData.reqId}</h2>
      <hr className="mb-8" />
      <div>
        {isLoading ? (
          <>Loading...</>
        ) : (
          <>
            {" "}
            {isAvailable ? (
              <>
                <ImageGallery
                  items={galleryImages}
                  lazyLoad
                  showNav={false}
                  //   autoPlay // TODO: enable this
                  // infinite //TODO: enable this
                />
              </>
            ) : (
              <>
                <p>No request found</p>
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default ImageViewingPage;

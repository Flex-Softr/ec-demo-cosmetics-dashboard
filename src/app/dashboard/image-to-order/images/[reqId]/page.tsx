"use client";

import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSingleImageToOrderReqQuery } from "@/redux/features/imageToOrder/imageToOrderApi";
import { TImageToOrderReq } from "@/redux/features/imageToOrder/imageToOrderInterface";
import { ImageIcon } from "lucide-react";
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

  if (isLoading) {
    return (
      <div className="space-y-5 p-4 sm:p-6">
        <PageHeader
          title="Request Images"
          subtitle="Loading request media…"
          icon={ImageIcon}
        />
        <ContentCard className="space-y-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-16 rounded-lg" />
            ))}
          </div>
        </ContentCard>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Request Images"
        subtitle={`Request ID: ${reqData.reqId || "—"}`}
        icon={ImageIcon}
      />
      <ContentCard>
        {isAvailable ? (
          <ImageGallery items={galleryImages} lazyLoad showNav={false} />
        ) : (
          <p className="py-8 text-center text-muted-foreground">
            No request found
          </p>
        )}
      </ContentCard>
    </div>
  );
};

export default ImageViewingPage;

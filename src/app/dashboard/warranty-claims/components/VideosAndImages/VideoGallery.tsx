import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TVideosAndImages } from "@/redux/features/warrantyClaimRequests/warrantyClaimInterface";

const VideoGallery = ({ videos }: { videos: TVideosAndImages[] }) => {
  return (
    <div className="w-10/12">
      <Carousel className="relative left-1/2 translate-x-[-40%]">
        <CarouselContent>
          {videos.map((video) => (
            <CarouselItem key={video._id} className="block">
              <video src={`${video.path}`} controls></video>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
        <CarouselPrevious />
      </Carousel>
    </div>
  );
};

export default VideoGallery;

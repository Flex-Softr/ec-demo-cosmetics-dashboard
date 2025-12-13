import config from "@/config/config";
import fetchData from "@/utilities/fetchData";
import Image from "next/image";

const ImageDetails = async ({ params }: { params: { imageId: string } }) => {
  const { data } = await fetchData({
    endPoint: `/images/${params.imageId}`,
    tags: ["singleImage"],
  });

  return (
    <div className="max-w-[740px] max-h-[740px] relative rounded-sm mx-auto my-auto">
      <Image
        src={`${config.base_url}/${data.src}`}
        alt={data.alt}
        layout="responsive"
        width={740} // Sets the maximum width
        height={740} // Sets the height relative to the width to maintain the aspect ratio
        className="object-cover rounded-sm"
      />
    </div>
  );
};

export default ImageDetails;

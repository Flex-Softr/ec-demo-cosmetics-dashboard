import Image from "next/image";
import loadingGif from "../../../public/loading.gif";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 h-[100vh]">
      <Image src={loadingGif} alt="loading" priority={true}></Image>
    </div>
  );
};

export default Loading;

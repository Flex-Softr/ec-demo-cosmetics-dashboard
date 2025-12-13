import Image from "next/image";
import loadingGif from "../../public/loading.gif";
import logo from "../../public/logo.jpg";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 h-[100vh]">
      <Image src={logo} alt="logo" width={100} priority={true}></Image>
      <h1 className="text-4xl">Welcome to Oneself</h1>
      <Image src={loadingGif} alt="loading" priority={true}></Image>
    </div>
  );
};

export default Loading;

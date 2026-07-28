import Image from "next/image";
import logo from "../../public/logo.png";

const Loading = () => {
  const SITE_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME;
  return (
    <div className="flex flex-col items-center justify-center gap-5 h-[100vh]">
      <Image src={logo} alt="logo" width={100} priority={true}></Image>
      <h1 className="text-4xl">Welcome to {SITE_NAME || "Electro commerce"}</h1>
      <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;

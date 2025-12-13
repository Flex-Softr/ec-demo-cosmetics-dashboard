import { getProfile } from "@/lib/getAccessToken";
import Image from "next/image";
import logo from "../../../public/logo.jpg";
import UserMenu from "../userMenu/UserMenu";
import Link from "next/link";
// import HideOrShowButton from "./HideOrShowButton";

const Navbar = async () => {
  const user = await getProfile();

  return (
    <div className="w-full h-[60px] flex justify-between items-center bg-white  border-b py-2 px-6 top-0 sticky z-10">
      {/* <div className="px-2 flex items-center justify-between w-64"> */}
      <div className="px-2">
        <Link href="/dashboard">
          <Image
            className="w-24"
            src={logo}
            alt="Some text"
            priority={true}
            placeholder="blur"
          />
        </Link>
        {/* <HideOrShowButton /> */}
      </div>
      <div>
        <UserMenu user={user} />
      </div>
    </div>
  );
};

export default Navbar;

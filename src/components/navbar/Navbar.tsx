import { accessTokenFromCookies, getProfile } from "@/lib/getAccessToken";
import UserMenu from "../userMenu/UserMenu";
import NavbarLogo from "./NavbarLogo";
import SidebarToggle from "./SidebarToggle";
// import HideOrShowButton from "./HideOrShowButton";

const Navbar = async () => {
  const user = await getProfile();
  const accessToken = await accessTokenFromCookies();

  return (
    <div className="w-full h-[56px] flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-100 py-2 px-6 top-0 sticky z-50 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4 lg:gap-x-20">
        <NavbarLogo />
        <SidebarToggle />
      </div>
      <div>
        <UserMenu user={user} accessToken={accessToken} />
      </div>
    </div>
  );
};

export default Navbar;

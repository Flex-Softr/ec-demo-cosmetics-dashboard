import { accessTokenFromCookies, getProfile } from "@/lib/getAccessToken";
import UserMenu from "../userMenu/UserMenu";
import NavbarLogo from "./NavbarLogo";
import SidebarToggle from "./SidebarToggle";
// import HideOrShowButton from "./HideOrShowButton";

const Navbar = async () => {
  const user = await getProfile();
  const accessToken = await accessTokenFromCookies();

  return (
    <div className="w-full h-[60px] flex justify-between items-center bg-white  border-b py-2 px-4 top-0 sticky z-10">
      {/* <div className="px-2 flex items-center justify-between w-64"> */}
      <div className="px-2 flex items-center justify-between w-64">
        <NavbarLogo />
        <SidebarToggle />
        {/* <HideOrShowButton /> */}
      </div>
      <div>
        <UserMenu user={user} accessToken={accessToken} />
      </div>
    </div>
  );
};

export default Navbar;

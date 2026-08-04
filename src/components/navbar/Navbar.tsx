"use client";

import UserMenu from "../userMenu/UserMenu";
import NavbarLogo from "./NavbarLogo";
import SidebarToggle from "./SidebarToggle";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between overflow-visible border-b border-border bg-card/90 px-4 py-2 backdrop-blur-md transition-all duration-300 sm:px-6">
      <div className="flex items-center gap-3 lg:gap-x-16">
        <NavbarLogo />
        <SidebarToggle />
      </div>
      <div className="relative shrink-0">
        <UserMenu />
      </div>
    </header>
  );
};

export default Navbar;

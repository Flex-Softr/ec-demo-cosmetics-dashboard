import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import ActiveLink from "../activeLink/ActiveLink";

type TProps = {
  name: string;
  href: string;
  icon?: ReactNode;
  className?: string;
  activeClassName?: string;
};

const NavLink = ({ name, href, icon, className, activeClassName }: TProps) => {
  return (
    <ActiveLink
      name={name}
      href={href}
      icon={icon}
      className={cn(
        "px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transparent",
        className
      )}
      activeClassName={activeClassName}
    />
  );
};

export default NavLink;

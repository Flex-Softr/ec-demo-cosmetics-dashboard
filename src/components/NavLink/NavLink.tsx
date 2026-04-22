"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import ActiveLink from "../activeLink/ActiveLink";
import { useSidebar } from "@/providers/SidebarProvider";

type TProps = {
  name: string;
  href: string;
  icon?: ReactNode;
  badge?: ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
};

const NavLink = ({
  name,
  href,
  icon,
  badge,
  className,
  activeClassName,
  onClick,
}: TProps) => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  const handleClick = () => {
    // Call explicit onClick if provided
    if (onClick) onClick();
    // Auto collapse on mobile view
    if (window.innerWidth < 768 && !isCollapsed) {
      toggleSidebar();
    }
  };

  return (
    <ActiveLink
      name={name}
      href={href}
      icon={icon}
      badge={badge}
      className={cn("w-full", className)}
      activeClassName={activeClassName}
      onClick={handleClick}
    />
  );
};

export default NavLink;

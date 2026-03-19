"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
type TProps = {
  name: string;
  href: string;
  icon?: ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
};

const ActiveLink = ({
  name,
  href,
  icon,
  className,
  activeClassName,
  onClick,
}: TProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const acClass = isActive
    ? activeClassName
      ? activeClassName
      : "bg-primary text-white font-bold rounded-lg shadow-md"
    : "text-gray-600 hover:bg-gray-50 hover:text-primary font-semibold rounded-lg";

  return (
    <Link href={href} onClick={onClick}>
      <span
        className={cn(
          "group flex gap-3 items-center px-2 py-2 my-0.5 transition-all duration-300 ease-in-out cursor-pointer select-none mx-1.5",
          acClass,
          className
        )}
      >
        <span
          className={cn(
            "transition-all duration-300 group-hover:scale-110 shrink-0",
            isActive
              ? "text-white scale-110 drop-shadow-sm"
              : "text-gray-500 group-hover:text-primary"
          )}
        >
          {icon}
        </span>
        <span className="truncate tracking-wide text-sm">{name}</span>
      </span>
    </Link>
  );
};

export default ActiveLink;

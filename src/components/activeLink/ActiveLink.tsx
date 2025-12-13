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
};

const ActiveLink = ({
  name,
  href,
  icon,
  className,
  activeClassName,
}: TProps) => {
  const pathname = usePathname();
  const acClass =
    pathname === href
      ? activeClassName
        ? activeClassName
        : "bg-primary text-white hover:bg-primary hover:text-white"
      : "";
  return (
    <Link href={href}>
      <span
        className={cn(
          "group flex gap-2 items-center rounded-md",
          className,
          acClass
        )}
      >
        {icon}
        <span>{name}</span>
      </span>
    </Link>
  );
};

export default ActiveLink;

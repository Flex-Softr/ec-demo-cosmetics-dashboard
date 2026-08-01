"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type TProps = {
  name: string;
  href: string;
  icon?: ReactNode;
  badge?: ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
};

const ActiveLink = ({
  name,
  href,
  icon,
  badge,
  className,
  activeClassName,
  onClick,
}: TProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const acClass = isActive
    ? activeClassName
      ? activeClassName
      : "bg-primary/10 text-primary font-semibold"
    : "text-foreground/85 hover:bg-muted hover:text-foreground font-medium";

  return (
    <Link href={href} onClick={onClick}>
      <span
        className={cn(
          "group relative flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors duration-200 ease-out",
          acClass,
          className
        )}
      >
        {icon && (
          <span
            className={cn(
              "shrink-0 transition-colors duration-200",
              isActive
                ? "text-primary"
                : "text-foreground/75 group-hover:text-foreground"
            )}
          >
            {icon}
          </span>
        )}
        {name ? (
          <span className="flex-1 truncate text-sm tracking-wide">{name}</span>
        ) : null}
        {badge}
      </span>
    </Link>
  );
};

export default ActiveLink;

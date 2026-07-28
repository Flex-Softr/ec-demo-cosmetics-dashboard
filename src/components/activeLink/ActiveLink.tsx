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
      : "bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/20"
    : "text-foreground hover:bg-accent hover:text-primary font-medium";

  return (
    <Link href={href} onClick={onClick}>
      <span
        className={cn(
          "group relative flex gap-2.5 items-center px-2.5 py-2 my-0.5 rounded-lg transition-all duration-200 ease-out cursor-pointer select-none",
          acClass,
          className
        )}
      >
        {icon && (
          <span
            className={cn(
              "shrink-0 transition-colors duration-200",
              isActive
                ? "text-primary-foreground"
                : "text-foreground group-hover:text-primary"
            )}
          >
            {icon}
          </span>
        )}
        {name ? (
          <span className="truncate tracking-wide text-sm flex-1">{name}</span>
        ) : null}
        {badge}
      </span>
    </Link>
  );
};

export default ActiveLink;

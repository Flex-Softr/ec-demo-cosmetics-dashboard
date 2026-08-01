import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ContentCardProps = {
  children: ReactNode;
  className?: string;
};

const ContentCard = ({ children, className }: ContentCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-none",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ContentCard;

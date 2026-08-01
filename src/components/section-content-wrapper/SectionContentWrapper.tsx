"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type TProps = {
  children: React.ReactNode;
  heading?: string;
  className?: string;
  collapse?: boolean;
  height?: string;
};

const SectionContentWrapper = ({
  children,
  heading,
  className,
  height,
  collapse,
}: TProps) => {
  const [isCollapsed, setIsCollapsed] = useState(collapse || false);

  return (
    <div
      className={cn(
        "relative space-y-4 rounded-xl border border-border bg-card p-4 shadow-none sm:p-5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          {heading}
        </h2>
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={isCollapsed ? "Expand section" : "Collapse section"}
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </button>
      </div>
      {!isCollapsed && <div className={height}>{children}</div>}
    </div>
  );
};

export default SectionContentWrapper;

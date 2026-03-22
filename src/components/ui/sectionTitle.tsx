import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type TProps = React.HTMLAttributes<HTMLSpanElement> & {
  children: string | ReactNode;
  className?: string;
};

export function SectionTitle({ children, className, ...props }: TProps) {
  return (
    <>
      <span
        className={cn(
          "w-full pb-2 text-sm font-semibold tracking-tight first:mt-0",
          className
        )}
        {...props}
      >
        {children}
      </span>
      <hr />
    </>
  );
}

import { ReactNode } from "react";

type TProps = {
  children: string | ReactNode;
  className?: string;
};
export function SectionTitle({ children, className }: TProps) {
  return (
    <>
      <span
        className={`w-full pb-2 text-sm font-semibold tracking-tight first:mt-0 ${className}`}
      >
        {children}
      </span>
      <hr />
    </>
  );
}

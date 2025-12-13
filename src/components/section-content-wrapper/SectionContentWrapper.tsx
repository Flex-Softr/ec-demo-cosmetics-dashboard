"use client";

import { useState } from "react";
import { Card } from "../ui/card";
type TProps = {
  children: React.ReactNode;
  heading?: string;
  className?: string;
  collapse?: boolean;
};
const SectionContentWrapper = ({
  children,
  heading,
  className,
  collapse,
}: TProps) => {
  const [isCollapsed, setIsCollapsed] = useState(collapse || false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Card className="p-4 shadow-none rounded-xl space-y-5 relative">
      <div className="flex justify-between items-center">
        <h2
          className={`scroll-m-20  text-sm font-semibold tracking-tight first:mt-0 ${className}`}
        >
          {heading}
        </h2>
        {isCollapsed ? (
          <svg
            onClick={() => toggleCollapse()}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        ) : (
          <svg
            onClick={() => toggleCollapse()}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 15.75 7.5-7.5 7.5 7.5"
            />
          </svg>
        )}
      </div>
      {/* <hr className="my-2 border-primary"/> */}
      {!isCollapsed && <>{children}</>}
    </Card>
  );
};

export default SectionContentWrapper;

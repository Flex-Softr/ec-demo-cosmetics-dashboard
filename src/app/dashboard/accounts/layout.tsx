import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="m-2 sm:m-4">{children}</div>;
};

export default layout;

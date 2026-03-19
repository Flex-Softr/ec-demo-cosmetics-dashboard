import { Card } from "@/components/ui/card";
import React from "react";
import Sidebar from "./components/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="m-2 sm:m-4 p-4 sm:p-6 min-h-[calc(100vh-200px)]">
      <h2 className="text-xl font-bold mb-4">My profile</h2>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <Sidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </Card>
  );
};

export default layout;

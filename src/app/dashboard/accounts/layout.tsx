import { Card } from "@/components/ui/card";
import React from "react";
import Sidebar from "./components/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="p-4 shadow-none rounded-xl m-3 h-[calc(100vh-200px)]">
      <h2 className="text-xl font-bold">My profile</h2>
      <div className="flex gap-2">
        <Sidebar />
        {children}
      </div>
    </Card>
  );
};

export default layout;

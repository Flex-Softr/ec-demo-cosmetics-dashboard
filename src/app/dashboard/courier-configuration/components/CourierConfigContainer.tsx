"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import AddCourierConfigModal from "./AddCourierConfigModal";
import CourierConfigTable from "./CourierConfigTable";

export default function CourierConfigContainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="space-y-6 m-4">
      <div className="flex items-center justify-between p-4 pb-0">
        <h1 className="text-2xl font-bold tracking-tight">
          Courier Configuration
        </h1>
        {/* <Button onClick={() => setIsOpen(true)} className="rounded-full">
          <Plus className="mr-2 h-4 w-4" /> Add Courier
        </Button> */}
      </div>

      <div className="p-4 pt-0">
        <CourierConfigTable setIsOpen={setIsOpen} />
      </div>
      <AddCourierConfigModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </Card>
  );
}

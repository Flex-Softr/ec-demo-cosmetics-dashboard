"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import HomepageSectionForm from "./components/HomepageSectionForm";
import HomepageSectionTable from "./components/HomepageSectionTable";

export default function HomepageSectionPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Homepage Sections</h1>
        <HomepageSectionForm
          trigger={
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Homepage Section
            </Button>
          }
        />
      </div>

      <HomepageSectionTable />
    </div>
  );
}

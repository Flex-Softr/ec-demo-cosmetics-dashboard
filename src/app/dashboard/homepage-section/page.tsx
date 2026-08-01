"use client";

import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Plus } from "lucide-react";
import HomepageSectionForm from "./components/HomepageSectionForm";
import HomepageSectionTable from "./components/HomepageSectionTable";

export default function HomepageSectionPage() {
  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Homepage Sections"
        subtitle="Manage homepage content sections and order"
        icon={LayoutGrid}
        actions={
          <HomepageSectionForm
            trigger={
              <Button size="sm" className="rounded-lg gap-1.5">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Section</span>
              </Button>
            }
          />
        }
      />

      <ContentCard>
        <HomepageSectionTable />
      </ContentCard>
    </div>
  );
}

"use client";

import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Package } from "lucide-react";
import { useState } from "react";
import AddCourierConfigModal from "./AddCourierConfigModal";
import CourierConfigTable from "./CourierConfigTable";

export default function CourierConfigContainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Courier Configuration"
        subtitle="Manage courier providers and connection settings"
        icon={Package}
      />
      <ContentCard>
        <CourierConfigTable setIsOpen={setIsOpen} />
      </ContentCard>
      <AddCourierConfigModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

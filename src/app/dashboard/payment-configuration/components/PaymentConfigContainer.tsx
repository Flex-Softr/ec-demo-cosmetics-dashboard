"use client";

import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus } from "lucide-react";
import { useState } from "react";
import AddPaymentConfigModal from "./AddPaymentConfigModal";
import PaymentConfigTable from "./PaymentConfigTable";

export default function PaymentConfigContainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Payment Configuration"
        subtitle="Manage your store's payment methods and required inputs"
        icon={CreditCard}
        actions={
          <Button
            size="sm"
            onClick={() => setIsOpen(true)}
            className="rounded-lg gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Payment Method</span>
          </Button>
        }
      />

      <ContentCard>
        <PaymentConfigTable setIsOpen={setIsOpen} />
      </ContentCard>

      <AddPaymentConfigModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

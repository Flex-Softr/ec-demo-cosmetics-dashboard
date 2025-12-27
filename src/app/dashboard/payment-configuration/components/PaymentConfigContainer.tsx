"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddPaymentConfigModal from "./AddPaymentConfigModal";
import PaymentConfigTable from "./PaymentConfigTable";

export default function PaymentConfigContainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="space-y-6 m-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Payment Configuration
          </h1>
          <p className="text-muted-foreground">
            Manage your store&apos;s payment methods and required user inputs.
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="rounded-full">
          <Plus className="mr-2 h-4 w-4" /> Add Payment Method
        </Button>
      </div>

      <PaymentConfigTable setIsOpen={setIsOpen} />

      <AddPaymentConfigModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </Card>
  );
}

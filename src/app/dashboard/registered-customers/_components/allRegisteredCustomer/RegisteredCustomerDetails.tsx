"use client";

import { Button } from "@/components/ui/button";
import { TRegisteredCustomer } from "@/types/registeredUser";
import { Eye } from "lucide-react";
import Link from "next/link";

const RegisteredCustomerDetails = ({
  customer,
}: {
  customer: TRegisteredCustomer;
}) => {
  return (
    <div className="flex justify-center">
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
        title="View Details"
      >
        <Link href={`/dashboard/registered-customers/${customer._id}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

export default RegisteredCustomerDetails;

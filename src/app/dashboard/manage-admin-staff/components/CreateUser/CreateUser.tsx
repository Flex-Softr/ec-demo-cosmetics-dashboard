"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const CreateUser = () => {
  return (
    <Button asChild size="sm" className="rounded-lg gap-1.5">
      <Link href="/dashboard/manage-admin-staff/create">
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">New Admin</span>
      </Link>
    </Button>
  );
};

export default CreateUser;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

type TProps = {
  text: string;
  className?: string;
  iconClassName?: string;
};

const CreateOrder = (props: TProps) => {
  const { text, className, iconClassName } = props;

  return (
    <Button asChild size="sm" className={className}>
      <Link href="/dashboard/orders/create">
        <Plus className={iconClassName} />{" "}
        <span className="hidden sm:inline">{text}</span>
      </Link>
    </Button>
  );
};

export default CreateOrder;

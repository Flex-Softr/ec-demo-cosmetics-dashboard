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
    <Link href="/dashboard/orders/create">
      <Button className={className}>
        <Plus className={iconClassName} /> <span>{text}</span>
      </Button>
    </Link>
  );
};

export default CreateOrder;

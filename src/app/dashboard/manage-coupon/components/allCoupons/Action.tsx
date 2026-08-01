"use client";

import { Button } from "@/components/ui/button";
import { TCoupon } from "@/redux/features/coupon/couponInterface";
import { SquarePen, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DeleteCoupon from "./DeleteCoupon";

const Action = ({ coupon }: { coupon: TCoupon }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <div className="flex items-center justify-center gap-0.5">
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
      >
        <Link href={`/dashboard/manage-coupon/${coupon._id}/edit`}>
          <SquarePen className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        onClick={() => setOpenDeleteModal(true)}
      >
        <Trash2Icon className="h-4 w-4" />
      </Button>

      <DeleteCoupon
        coupon={coupon}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />
    </div>
  );
};

export default Action;

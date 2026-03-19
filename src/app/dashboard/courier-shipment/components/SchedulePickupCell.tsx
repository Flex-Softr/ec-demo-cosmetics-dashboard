"use client";

import SchedulePickup from "@/app/dashboard/orders/components/SchedulePickup/SchedulePickup";
import { Button } from "@/components/ui/button";
import { TOrders } from "@/types/order.interface";
import { Truck } from "lucide-react";
import { useState } from "react";

const SchedulePickupCell = ({ order }: { order: TOrders }) => {
  const [open, setOpen] = useState(false);

  if (order.status !== "processing done") {
    return (
      <div className="flex justify-center italic text-xs text-muted-foreground">
        -
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 h-8 px-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-200"
      >
        <Truck className="w-4 h-4" />
        <span className="text-xs font-semibold">Pickup</span>
      </Button>

      <SchedulePickup
        open={open}
        handleOpen={() => setOpen(!open)}
        order={order}
      />
    </div>
  );
};

export default SchedulePickupCell;

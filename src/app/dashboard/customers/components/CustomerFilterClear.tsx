"use client";

import { Button } from "@/components/ui/button";
import { setCompletedOrderFilterClear } from "@/redux/features/completedOrders/completedOrdersSlice";
import { setDate } from "@/redux/features/orders/ordersSlice";
import { useAppDispatch } from "@/redux/hooks";
import { X } from "lucide-react";
import { useEffect } from "react";

const CustomerFilterClear = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCompletedOrderFilterClear());
    dispatch(
      setDate({
        startFrom: "",
        endAt: "",
      })
    );
  }, [dispatch]); // Clear filter on component mount

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        className="h-10 rounded-lg gap-1.5 text-muted-foreground"
        onClick={() => {
          dispatch(setCompletedOrderFilterClear());
        }}
      >
        Clear Filter <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CustomerFilterClear;

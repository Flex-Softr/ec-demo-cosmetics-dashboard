"use client";

import { Button } from "@/components/ui/button";
import { setCustomerOrderFilterClear } from "@/redux/features/customerOrders/customerOrdersSlice";
import { setDate } from "@/redux/features/orders/ordersSlice";
import { useAppDispatch } from "@/redux/hooks";
import { X } from "lucide-react";
import { useEffect } from "react";

const CustomerFilterClear = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCustomerOrderFilterClear());
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
        className="w-32 h-9 border border-primary outline-primary rounded-md text-gray-600 hover:text-gray-900"
        onClick={() => {
          dispatch(setCustomerOrderFilterClear());
          //   dispatch(
          //     setDate({
          //       startFrom: "",
          //       endAt: "",
          //     })
          //   );
        }}
      >
        Clear Filter <X className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default CustomerFilterClear;

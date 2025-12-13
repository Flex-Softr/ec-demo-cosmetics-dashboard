"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Invoice from "@/components/invoice/Invoice";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useUpdateOrdersStatusMutation } from "@/redux/features/orders/ordersApi";
import { setBulkOrder } from "@/redux/features/orders/ordersSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { refetchData } from "@/utilities/fetchData";
// import { refetchData } from "@/utilities/fetchData";
import statusOptions from "@/utilities/statusOptions";
import { useState } from "react";

const BulkAction = () => {
  const dispatch = useAppDispatch();
  const [updateOrderStatus, { isLoading }] = useUpdateOrdersStatusMutation();
  const { orderIds, invoices } = useAppSelector(
    ({ orders }) => orders.bulkOrders
  );

  const { selectedStatus: filter } = useAppSelector(({ orders }) => orders);

  const [bulkAction, setBulkAction] = useState("bulk");

  const updatePayload = {
    orderIds,
    status: bulkAction,
  };

  const handleBulkAction = async () => {
    try {
      if (bulkAction !== "bulk") {
        if (orderIds.length) {
          const res = await updateOrderStatus(updatePayload).unwrap();
          if (res.success) {
            await refetchData("allOrders");
            await refetchData("customerOrderHistory");
            dispatch(setBulkOrder({ orderIds: [] }));
            // dispatch(setIsOrderUpdate(!iSOrderUpdate));
            toast({
              className: "bg-success text-white text-2xl",
              title: "The orders status was successfully updated!",
            });
            return;
          } else {
            throw new Error(res.message);
          }
        } else {
          alert("Please select an order.");
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.message || "Failed to update order status!",
      });
    }
  };

  const isBulkAction =
    filter == "pending" || filter == "confirmed" || filter == "follow up";
  const isInvoice = filter == "processing";

  return (
    <>
      {isBulkAction && (
        <div className="flex items-center gap-2">
          <Select onValueChange={(value) => setBulkAction(value)}>
            <SelectTrigger className="border-primary focus:ring-primary focus:ring-1">
              <SelectValue placeholder="Bulk Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="capitalize">
                <SelectItem value="bulk">Bulk Actions</SelectItem>
                {statusOptions(filter).map((status) => (
                  <SelectItem value={status} key={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleBulkAction} disabled={isLoading}>
            Apply
          </Button>
        </div>
      )}
      {isInvoice && <Invoice orders={invoices} />}
    </>
  );
};

export default BulkAction;

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
import { setIsOrderUpdate } from "@/redux/features/orders/ordersSlice";
import { useUpdateProcessingOrderStatusMutation } from "@/redux/features/processingOrders/processingOrdersApi";
import { setBulkOrder } from "@/redux/features/processingOrders/processingOrdersSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { refetchData } from "@/utilities/fetchData";
import statusOptions from "@/utilities/statusOptions";
import { useState } from "react";

const BulkAction = () => {
  const dispatch = useAppDispatch();
  const [updateProcessingOrderStatus, { isLoading }] =
    useUpdateProcessingOrderStatusMutation();
  const {
    selectedStatus,
    bulkOrders: { orderIds, invoices },
  } = useAppSelector(({ processingOrders }) => processingOrders);
  const { iSOrderUpdate } = useAppSelector(({ orders }) => orders);

  const [bulkAction, setBulkAction] = useState("bulk");

  const updatePayload = {
    orderIds,
    status: bulkAction,
  };

  const handleBulkAction = async () => {
    try {
      if (bulkAction !== "bulk") {
        if (orderIds.length) {
          const res = await updateProcessingOrderStatus(updatePayload).unwrap();
          if (res.success) {
            await refetchData("processingOrders");
            await refetchData("customerOrderHistory");
            dispatch(setIsOrderUpdate(!iSOrderUpdate));
            dispatch(setBulkOrder({ orderIds: [] }));
            toast({
              className: "bg-success text-white text-2xl",
              title: "The orders updated successfully!",
            });
            return;
          } else {
            throw new Error(res.message);
          }
        } else {
          alert("Please select an order!");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.message || "Failed to update status!",
      });
    }
  };

  const isBulkAction = selectedStatus !== "processing done";

  return (
    <div className={"flex gap-10 items-center"}>
      {isBulkAction && (
        <div className="flex items-center gap-2">
          <Select onValueChange={(value) => setBulkAction(value)}>
            <SelectTrigger className="border-primary focus:ring-primary focus:ring-1">
              <SelectValue placeholder="Bulk Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="capitalize">
                <SelectItem value="bulk">Bulk Actions</SelectItem>
                {statusOptions(selectedStatus).map((status) => (
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
      <Invoice orders={invoices} />
    </div>
  );
};

export default BulkAction;

"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { refetchData } from "@/utilities/fetchData";
import { useSendCourierAndUpdateStatusMutation } from "@/redux/features/courierManagement/courierManagementApi";
import { setBulkOrder } from "@/redux/features/courierManagement/courierManagementSlice";
import { refetchData } from "@/utilities/fetchData";
import statusOptions from "@/utilities/statusOptions";
import { useState } from "react";

const CourierBulkAction = () => {
  const dispatch = useAppDispatch();
  const [sendCourierAndUpdateStatus, { isLoading }] =
    useSendCourierAndUpdateStatusMutation();
  const { orderIds } = useAppSelector(
    ({ courierManagement }) => courierManagement.bulkOrders
  );
  const filter = useAppSelector(
    ({ courierManagement }) => courierManagement.selectedStatus
  );
  const [bulkAction, setBulkAction] = useState("bulk");

  const updatePayload = {
    orderIds,
    status: bulkAction,
  };

  const handleBulkAction = async () => {
    try {
      if (bulkAction !== "bulk") {
        const res = await sendCourierAndUpdateStatus(updatePayload).unwrap();
        if (res.success) {
          await refetchData("processingDoneOrders");
          await refetchData("customerOrderHistory");
          dispatch(setBulkOrder({ orderIds: [] }));
          // dispatch(setIsOrderUpdate(!iSOrderUpdate));

          toast({
            className: "bg-success text-white text-2xl",
            title: "The orders status was successfully updated!",
          });
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.message || "Courier entry is failed!",
      });
    }
  };

  return (
    <div className={"flex gap-10 items-center"}>
      {statusOptions(filter).length ? (
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
      ) : null}
    </div>
  );
};

export default CourierBulkAction;

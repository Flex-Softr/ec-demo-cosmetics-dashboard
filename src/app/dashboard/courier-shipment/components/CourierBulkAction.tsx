"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useBulkSchedulePickupMutation } from "@/redux/features/courierShipment/courierShipmentApi";
import { setBulkOrder } from "@/redux/features/courierShipment/courierShipmentSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import statusOptions from "@/utilities/statusOptions";
import { useState } from "react";
import BulkSchedulePickup from "./BulkSchedulePickup";
import PrintInvoiceButton from "../../orders/[orderId]/components/invoice/PrintInvoiceButton";

const CourierBulkAction = () => {
  const dispatch = useAppDispatch();
  const [bulkSchedulePickup, { isLoading }] = useBulkSchedulePickupMutation();
  const { orderIds, invoices } = useAppSelector(
    ({ courierShipment }) => courierShipment.bulkOrders
  );
  const filter = useAppSelector(
    ({ courierShipment }) => courierShipment.selectedStatus
  );
  const [bulkAction, setBulkAction] = useState("bulk");
  const [openBulkPickup, setOpenBulkPickup] = useState(false);

  const updatePayload = {
    orderIds,
    status: bulkAction,
  };

  const handleBulkAction = async () => {
    if (bulkAction === "schedule pickup") {
      if (orderIds.length === 0) {
        toast({
          title: "Please select at least one order",
          variant: "destructive",
        });
        return;
      }
      setOpenBulkPickup(true);
      return;
    }

    try {
      if (bulkAction !== "bulk") {
        const res = await bulkSchedulePickup(updatePayload).unwrap();
        if (res.success) {
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
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 items-start sm:items-center">
      {statusOptions(filter).length && filter !== "on courier" ? (
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select onValueChange={(value) => setBulkAction(value)}>
            <SelectTrigger className="h-10 w-44 rounded-lg border-border capitalize focus:ring-2 focus:ring-primary/20">
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
          <Button
            size="sm"
            onClick={handleBulkAction}
            disabled={isLoading}
            className="h-10 rounded-lg"
          >
            Apply
          </Button>
        </div>
      ) : null}

      <div className="w-full sm:w-auto">
        <PrintInvoiceButton orders={invoices} />
      </div>

      <BulkSchedulePickup
        open={openBulkPickup}
        handleOpen={() => setOpenBulkPickup(!openBulkPickup)}
        orderIds={orderIds}
      />
    </div>
  );
};

export default CourierBulkAction;

"use client";
import CommonModal from "@/components/modal/CommonModal";
import { cn } from "@/lib/utils";
import { softOrderStatusClass } from "@/lib/tableStyles";
import { useAppSelector } from "@/redux/hooks";
import { TOrders } from "@/types/order.interface";
import { TPermission } from "@/utilities/isPermitted";
import { useState } from "react";
import UpdateOrderStatus from "./UpdateOrderStatus";

type TProps = {
  order: TOrders;
  deliveryStatus?: string;
  disableStatus?: string[];
  permissions: TPermission[];
  currentRoute?: string;
};

const OrderStatus = ({
  order,
  deliveryStatus,
  disableStatus = [],
  permissions,
  currentRoute,
}: TProps) => {
  const [open, setOpen] = useState(false);
  const editPermission = useAppSelector(
    ({ monitorDelivery }) => monitorDelivery.editPermission
  );
  const handleOpen = () => setOpen((prev) => !prev);

  const status = deliveryStatus ? deliveryStatus : order.status;
  const showStatus = deliveryStatus
    ? deliveryStatus?.length > 18
      ? deliveryStatus?.slice(0, 18) + "…"
      : deliveryStatus
    : order.status;
  const isDisabled = disableStatus.includes(status) && !editPermission;

  return (
    <>
      <button
        onClick={handleOpen}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-opacity whitespace-nowrap",
          softOrderStatusClass(status),
          !isDisabled && "hover:opacity-80 cursor-pointer",
          isDisabled && "cursor-default opacity-80"
        )}
        title={deliveryStatus || undefined}
      >
        {showStatus}
      </button>
      <CommonModal
        open={open}
        handleOpen={handleOpen}
        className="h-[180px] w-[400px]"
        modalTitle="Update order status"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Current status:</span>
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium capitalize",
              softOrderStatusClass(status)
            )}
          >
            {status}
          </span>
        </div>
        <UpdateOrderStatus
          status={status}
          _id={order._id}
          handleOpen={handleOpen}
          permissions={permissions}
          order={order}
          disableStatus={disableStatus}
          currentRoute={currentRoute}
        />
      </CommonModal>
    </>
  );
};

export default OrderStatus;

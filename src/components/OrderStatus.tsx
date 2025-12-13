import CommonModal from "@/components/modal/CommonModal";
import { TOrders } from "@/types/order/order.interface";
import backgroundColor from "@/utilities/backgroundColor";
import { useState } from "react";
import UpdateOrderStatus from "./UpdateOrderStatus";

type TProps = {
  order: TOrders;
  deliveryStatus?: string;
  disableStatus?: string[];
};

const OrderStatus = ({ order, deliveryStatus, disableStatus = [] }: TProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  const status = deliveryStatus ? deliveryStatus : order.status;
  const showStatus = deliveryStatus
    ? deliveryStatus?.length > 14
      ? deliveryStatus?.slice(0, 14) + "..."
      : deliveryStatus
    : order.status;

  return (
    <>
      <button
        onClick={handleOpen}
        disabled={disableStatus.includes(status)}
        className={`capitalize px-2 pb-[2px] pt-[1px] text-white rounded ${backgroundColor(status)}`}
        title={deliveryStatus ? deliveryStatus : ""}
      >
        {showStatus}
      </button>
      <CommonModal
        open={open}
        handleOpen={handleOpen}
        className="h-[180px] w-[400px]"
        modalTitle="Update order status"
      >
        <div>
          <span>Current status : </span>
          <span
            className={`capitalize px-2 pb-[2px] pt-[1px] text-white rounded ${backgroundColor(status)}`}
          >
            {status}
          </span>
        </div>
        <UpdateOrderStatus
          status={status}
          _id={order._id}
          handleOpen={handleOpen}
          // disableStatus={disableStatus}
        />
      </CommonModal>
    </>
  );
};

export default OrderStatus;

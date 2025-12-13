import CommonModal from "@/components/modal/CommonModal";
import { TOrders } from "@/types/order/order.interface";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { refetchData } from "@/utilities/fetchData";
import { useState } from "react";
import { useUpdateOrderMutation } from "@/redux/features/orders/ordersApi";

const backgroundColor = (status: string) => {
  switch (status) {
    case "not monitoring":
      return "bg-gray-400 text-white";
    case "monitoring":
      return "bg-green-500 text-white";
    case "low warning":
      return "bg-yellow-500 text-black";
    case "high warning":
      return "bg-red-500 text-white";
    case "not contacted":
      return "bg-gray-500 text-white";
    case "contact again":
      return "bg-orange-500 text-white";
    case "completed today":
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-300 text-black";
  }
};

type TProps = {
  order: TOrders;
  statusOptions: string[];
  monitor: string;
};

const MonitoringAndTracking = ({
  order,
  statusOptions = [],
  monitor,
}: TProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  const [action, setAction] = useState("");
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  const currentStatus =
    monitor === "monitoring" ? order.monitoringStatus : order.trackingStatus;
  const actionFrom =
    monitor === "monitoring" ? "monitoringStatus" : "trackingStatus";

  const handleSubmit = async () => {
    const updatePayload = {
      _id: order._id,
      payload: { [actionFrom]: action },
    };

    try {
      if (action) {
        const res = await updateOrder(updatePayload).unwrap();

        if (res.success) {
          // await refetchData("allOrders");
          await refetchData("singleOrder");
          await refetchData("customerOrderHistory");
          // dispatch(setIsOrderUpdate(!iSOrderUpdate));
          toast({
            className: "bg-success text-white text-2xl",
            title: "Status updated successfully!",
          });
          if (handleOpen) {
            handleOpen();
          }
          return;
        } else {
          throw new Error(res.message);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.message || error?.data?.message,
      });
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className={`capitalize px-2 pb-[2px] pt-[1px] text-white rounded ${backgroundColor(currentStatus)}`}
        title={currentStatus}
      >
        {currentStatus}
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
            className={`capitalize px-2 pb-[2px] pt-[1px] text-white rounded ${backgroundColor(currentStatus)}`}
          >
            {currentStatus}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <select
            onChange={(e) => setAction(e.target.value)}
            className="h-9 border border-primary outline-primary rounded-md capitalize"
          >
            <option value="">Update status</option>
            {statusOptions.map((status) => (
              <option value={status} key={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="self-end bg-primary"
              // size={"sm"}
            >
              Update
            </Button>
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default MonitoringAndTracking;

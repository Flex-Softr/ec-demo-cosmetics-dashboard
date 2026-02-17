"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useSendCourierAndUpdateStatusMutation } from "@/redux/features/courierShipment/courierShipmentApi";
import { useCourierReturnedOrdersMutation } from "@/redux/features/monitorDelivery/monitorDeliveryApi";
import { useUpdateOrdersStatusMutation } from "@/redux/features/orders/ordersApi";
import { useUpdateProcessingOrderStatusMutation } from "@/redux/features/processingOrders/processingOrdersApi";
import { PERMISSIONS } from "@/const/permissions";
import { TOrders } from "@/types/order.interface";
import isPermitted, { TPermission } from "@/utilities/isPermitted";
import { revalidateTag, TTags } from "@/utilities/revalidate";
import statusOptions from "@/utilities/statusOptions";
import { useState } from "react";

type TProps = {
  _id: string;
  status: string;
  order: TOrders;
  handleOpen?: () => void;
  permissions: TPermission[];
};

const UpdateOrderStatus = ({
  _id,
  status,
  order,
  handleOpen,
  permissions,
}: TProps) => {
  const [action, setAction] = useState("");
  const [updateOrdersStatus, { isLoading }] = useUpdateOrdersStatusMutation();
  const [updateProcessingOrdersStatus, { isLoading: loading }] =
    useUpdateProcessingOrderStatusMutation();
  const [sendCourierAndUpdateStatus, { isLoading: isSendLoading }] =
    useSendCourierAndUpdateStatusMutation();
  const [courierReturnedOrders, { isLoading: isReturnLoading }] =
    useCourierReturnedOrdersMutation();

  const ordersRoute = [
    "pending",
    "confirmed",
    "follow up",
    "canceled",
    "completed",
  ];
  const processingOrdersRoute = [
    "processing",
    "warranty processing",
    "warranty added",
  ];

  const courierRoute = ["processing done", "cancelled"];

  const courierReturnedRoute = ["On courier"];

  const hasPermission =
    (ordersRoute.includes(status) &&
      isPermitted(permissions, PERMISSIONS.MANAGE_ORDER)) ||
    (processingOrdersRoute.includes(status) &&
      isPermitted(permissions, PERMISSIONS.MANAGE_PROCESSING_ORDER)) ||
    (courierRoute.includes(status) &&
      isPermitted(permissions, PERMISSIONS.MANAGE_SHIPMENT_ORDER));

  if (!hasPermission) return null;

  const handleSubmit = async () => {
    const updatePayload = {
      orderIds: [_id],
      status: action,
    };

    const handleRevalidation = async (currentAction: string) => {
      if (
        currentAction === "canceled" ||
        currentAction === "returned" ||
        currentAction === "deleted" ||
        currentAction === "partial completed"
      ) {
        const productTags: TTags[] =
          order?.products?.flatMap((product: TOrders["products"][0]) => [
            `product-${product?.slug}` as TTags,
            `relatedProducts-${product?.slug}` as TTags,
            `collectionProducts-${product?.slug}` as TTags,
          ]) || [];

        await revalidateTag([
          ...productTags,
          "featuredProducts",
          "homepageIndividualSection",
        ]);
      }
    };

    try {
      if (ordersRoute.includes(status)) {
        const res = await updateOrdersStatus(updatePayload).unwrap();
        if (res.success) {
          await handleRevalidation(action);
          toast({
            className: "bg-success text-white text-2xl",
            title: "Order status updated successfully!",
          });
          if (handleOpen) {
            handleOpen();
          }
          return;
        } else {
          throw new Error(res.message);
        }
      }

      if (processingOrdersRoute.includes(status)) {
        const res = await updateProcessingOrdersStatus(updatePayload).unwrap();
        if (res.success) {
          await handleRevalidation(action);
          toast({
            className: "bg-success text-white text-2xl",
            title: "Order status updated successfully!",
          });
          if (handleOpen) {
            handleOpen();
          }
          return;
        } else {
          throw new Error(res.message);
        }
      }

      if (courierRoute.includes(status)) {
        const res = await sendCourierAndUpdateStatus(updatePayload).unwrap();
        if (res.success) {
          await handleRevalidation(action);
          toast({
            className: "bg-success text-white text-2xl",
            title: "Order status updated successfully!",
          });
          if (handleOpen) {
            handleOpen();
          }
          return;
        } else {
          throw new Error(res.message);
        }
      }

      if (courierReturnedRoute.includes(status)) {
        const res = await courierReturnedOrders(updatePayload).unwrap();
        if (res.success) {
          await handleRevalidation(action);
          toast({
            className: "bg-success text-white text-2xl",
            title: "Order status updated successfully!",
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
    <div className="flex items-center gap-5">
      <Select onValueChange={setAction}>
        <SelectTrigger className="w-[180px] h-9 border-primary capitalize">
          <SelectValue placeholder="Update status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions(status).map((statusOption) => (
            <SelectItem
              key={statusOption}
              value={statusOption}
              className="capitalize"
            >
              {statusOption}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading || isLoading || isSendLoading || isReturnLoading}
          className="self-end bg-primary"
          // size={"sm"}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default UpdateOrderStatus;

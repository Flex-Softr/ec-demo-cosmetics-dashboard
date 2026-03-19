"use client";
import CommonAlertDialog from "@/components/common/CommonAlertDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { PERMISSIONS, TPermissionName } from "@/const/permissions";
import { useAppSelector } from "@/redux/hooks";
import { useSendCourierAndUpdateStatusMutation } from "@/redux/features/courierShipment/courierShipmentApi";
import { useCourierReturnedOrdersMutation } from "@/redux/features/monitorDelivery/monitorDeliveryApi";
import { useUpdateOrdersStatusMutation } from "@/redux/features/orders/ordersApi";
import { useUpdateProcessingOrderStatusMutation } from "@/redux/features/processingOrders/processingOrdersApi";
import { TOrders } from "@/types/order.interface";
import isPermitted, { TPermission } from "@/utilities/isPermitted";
import { revalidateTag, TTags } from "@/utilities/revalidate";
import statusOptions from "@/utilities/statusOptions";
import { useState } from "react";

const ROUTE_MAP: Record<
  string,
  "orders" | "processing" | "courier" | "return"
> = {
  pending: "orders",
  confirmed: "orders",
  "follow up": "orders",
  canceled: "orders",
  completed: "orders",
  processing: "processing",
  "warranty processing": "processing",
  "warranty added": "processing",
  "processing done": "courier",
  cancelled: "courier",
  "On courier": "return",
  delivered: "return",
  partial_delivered: "return",
};

const ACTION_PERMISSION_MAP: Record<string, TPermissionName> = {
  pending: PERMISSIONS.MANAGE_ORDER,
  confirmed: PERMISSIONS.MANAGE_ORDER,
  "follow up": PERMISSIONS.MANAGE_ORDER,
  canceled: PERMISSIONS.MANAGE_ORDER,
  cancelled: PERMISSIONS.MANAGE_ORDER,
  deleted: PERMISSIONS.MANAGE_ORDER,

  processing: PERMISSIONS.MANAGE_PROCESSING_ORDER,
  "warranty processing": PERMISSIONS.MANAGE_PROCESSING_ORDER,
  "warranty added": PERMISSIONS.MANAGE_PROCESSING_ORDER,
  "processing done": PERMISSIONS.MANAGE_PROCESSING_ORDER,

  completed: PERMISSIONS.MANAGE_SHIPMENT_ORDER,
  "On courier": PERMISSIONS.MANAGE_SHIPMENT_ORDER,
  delivered: PERMISSIONS.MANAGE_SHIPMENT_ORDER,
  "partial completed": PERMISSIONS.MANAGE_SHIPMENT_ORDER,
  returned: PERMISSIONS.MANAGE_SHIPMENT_ORDER,
};

type TProps = {
  _id: string;
  status: string;
  order: TOrders;
  handleOpen?: () => void;
  permissions: TPermission[];
  disableStatus?: string[];
  currentRoute?: string;
};
const UpdateOrderStatus = ({
  _id,
  status,
  order,
  handleOpen,
  permissions,
  disableStatus = [],
  currentRoute,
}: TProps) => {
  const [action, setAction] = useState("");
  const editPermission = useAppSelector(
    ({ monitorDelivery }) => monitorDelivery.editPermission
  );
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [updateOrdersStatus, { isLoading }] = useUpdateOrdersStatusMutation();
  const [updateProcessingOrdersStatus, { isLoading: loading }] =
    useUpdateProcessingOrderStatusMutation();
  const [sendCourierAndUpdateStatus, { isLoading: isSendLoading }] =
    useSendCourierAndUpdateStatusMutation();
  const [courierReturnedOrders, { isLoading: isReturnLoading }] =
    useCourierReturnedOrdersMutation();

  const permittedOptions = statusOptions(status, currentRoute).filter(
    (option) => {
      // Check if the current status is in the disabled list
      // UNLESS editPermission (from monitor delivery) is true
      if (disableStatus.includes(status) && !editPermission) {
        return false;
      }

      const requiredPermission =
        ACTION_PERMISSION_MAP[option] || PERMISSIONS.MANAGE_ORDER;
      return isPermitted(permissions, requiredPermission);
    }
  );

  if (permittedOptions.length === 0) return null;

  const handleUpdateClick = () => {
    if (!action) {
      toast({
        variant: "destructive",
        title: "Please select a status",
      });
      return;
    }

    if (status === "processing done" && action === "completed") {
      setIsAlertOpen(true);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const route = ROUTE_MAP[status] || "orders";
    const requiredPermission =
      ACTION_PERMISSION_MAP[action] || PERMISSIONS.MANAGE_ORDER;

    if (!isPermitted(permissions, requiredPermission)) {
      toast({
        variant: "destructive",
        title: "Permission denied for this action",
      });
      return;
    }

    const updatePayload = {
      orderIds: [_id],
      status: action,
    };

    const handleRevalidation = async (currentAction: string) => {
      if (
        [
          "canceled",
          "returned",
          "deleted",
          "completed",
          "partial completed",
        ].includes(currentAction)
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
          "bestSellingProducts",
          "homepageIndividualSection",
        ]);
      }
    };

    try {
      let res;
      if (route === "orders") {
        res = await updateOrdersStatus(updatePayload).unwrap();
      } else if (route === "processing") {
        res = await updateProcessingOrdersStatus(updatePayload).unwrap();
      } else if (route === "courier") {
        res = await sendCourierAndUpdateStatus(updatePayload).unwrap();
      } else if (route === "return") {
        res = await courierReturnedOrders(updatePayload).unwrap();
      }
      if (res?.success) {
        toast({
          className: "bg-success text-white text-2xl",
          title: "Order status updated successfully!",
        });
        if (handleOpen) {
          handleOpen();
        }
        await handleRevalidation(action);
        return;
      } else {
        throw new Error(res?.message || "Failed to update order status");
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
          {permittedOptions.map((statusOption) => (
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
          onClick={handleUpdateClick}
          disabled={loading || isLoading || isSendLoading || isReturnLoading}
          className="self-end bg-primary"
          // size={"sm"}
        >
          Update
        </Button>
      </div>

      <CommonAlertDialog
        open={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        title="Are you absolutely sure?"
        description="This will mark the order directly as completed without going through the courier workflow. Are you sure you want to proceed?"
        onConfirm={() => {
          setIsAlertOpen(false);
          handleSubmit();
        }}
        confirmText="Proceed"
      />
    </div>
  );
};

export default UpdateOrderStatus;

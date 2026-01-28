"use client";
import SchedulePickup from "@/app/dashboard/orders/components/SchedulePickup/SchedulePickup";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/redux/hooks";
import { TOrders } from "@/types/order.interface";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Eye, Pencil, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const OrderActionDropDown = ({ order }: { order: TOrders }) => {
  const [openSchedulePickup, setOpenSchedulePickup] = useState(false);
  const editPermission = useAppSelector(
    ({ monitorDelivery }) => monitorDelivery.editPermission
  );

  const edit = [
    "pending",
    "confirmed",
    "follow up",
    "processing",
    "warranty processing",
    "warranty added",
    "On courier",
    // "processing done",
  ].includes(order.status);

  const isEdit =
    edit ||
    (order.deliveryStatus === "partial_delivered" &&
      order.status !== "partial completed" &&
      editPermission)
      ? true
      : false;

  return (
    <div className="flex justify-center items-center gap-2 min-w-[90px]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className="p-2 cursor-pointer">
            <DotsVerticalIcon className="h-4 w-4" />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link
                href={`/dashboard/orders/${order._id}`}
                className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </Link>
            </DropdownMenuItem>
            {order.status === "processing done" && (
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => setOpenSchedulePickup(true)}
              >
                <Truck className="w-4 h-4" />
                <span>Schedule pickup</span>
              </DropdownMenuItem>
            )}

            {isEdit && (
              <DropdownMenuItem>
                <Link
                  href={`/dashboard/orders/${order._id}/edit`}
                  title="Edit"
                  className="text-green-500 hover:text-green-700 flex items-center gap-1"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <SchedulePickup
        open={openSchedulePickup}
        handleOpen={() => setOpenSchedulePickup(!openSchedulePickup)}
        order={order}
      />
    </div>
  );
};
export default OrderActionDropDown;

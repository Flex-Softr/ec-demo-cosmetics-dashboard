"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { TOrders } from "@/types/order/order.interface";
import Link from "next/link";
import EditOrder from "@/app/dashboard/orders/[orderId]/components/EditOrder";
import { useAppSelector } from "@/redux/hooks";
import CreateOrder from "@/app/dashboard/orders/components/CreateOrder";
import { Eye } from "lucide-react";

const OrderActionDropDown = ({ order }: { order: TOrders }) => {
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
            {isEdit && (
              <div className="hover:bg-gray-100">
                <EditOrder
                  text="Edit"
                  order={{ ...order }}
                  className="bg-white hover:bg-gray-100 text-green-500 hover:text-green-700 my-0 mx-2 px-0 py-0 p-0 text-sm flex items-center gap-1 shadow-none"
                  iconClassName="w-4 h-4"
                />
              </div>
            )}

            {order.status !== "pending" &&
              order.status !== "confirmed" &&
              order.status !== "processing" &&
              order.status !== "follow up" && (
                <div className="hover:bg-gray-100">
                  <CreateOrder
                    text="Create"
                    order={{ ...order }}
                    className="bg-white hover:bg-gray-100 text-green-500 hover:text-green-700 my-0 mx-2 px-0 py-0 p-0 text-sm flex items-center gap-1 shadow-none"
                    iconClassName="w-4 h-4 font-bold"
                  />
                </div>
              )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default OrderActionDropDown;

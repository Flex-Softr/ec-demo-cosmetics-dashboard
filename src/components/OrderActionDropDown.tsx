"use client";
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
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";

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
    "On courier",
    "processing done",
  ].includes(order.status);

  const isEdit = edit || editPermission;

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
    </div>
  );
};
export default OrderActionDropDown;

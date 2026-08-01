"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/redux/hooks";
import { TOrders } from "@/types/order.interface";
import { Eye, MoreVertical, Pencil } from "lucide-react";
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
    "on courier",
    "processing done",
  ].includes(order.status);

  const isEdit = edit || editPermission;

  return (
    <div className="flex justify-end items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Order actions"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/orders/${order._id}`}
                className="flex items-center gap-2 cursor-pointer w-full"
              >
                <Eye className="w-4 h-4" />
                View
              </Link>
            </DropdownMenuItem>

            {isEdit && (
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/orders/${order._id}/edit`}
                  title="Edit"
                  className="flex items-center gap-2 cursor-pointer w-full"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
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

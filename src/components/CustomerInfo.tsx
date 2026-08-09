"use client";
import FraudCheck from "@/app/dashboard/fraud-check/FraudCheck";
import CustomerOrderHistory from "@/app/dashboard/orders/components/CustomerOrderHistory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import config from "@/config/config";
import { TOrders } from "@/types/order.interface";
import { Eye, MoreVertical, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CommonModal from "./modal/CommonModal";
import { Button } from "./ui/button";

const CustomerInfo = ({ order }: { order: TOrders }) => {
  const { shipping, deliveryStatus } = order || {};
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((prev) => !prev);

  return (
    <>
      <div className="relative flex min-w-0 max-w-[200px] flex-col gap-1 pr-7 text-left">
        <div
          className="flex min-w-0 items-center gap-1.5"
          title={shipping?.fullName}
        >
          <UserRound className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="line-clamp-1 text-sm font-medium capitalize text-foreground">
            {shipping?.fullName || "—"}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-1.5">
          <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate text-xs tabular-nums text-muted-foreground">
            {shipping?.phoneNumber || "—"}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-7 w-7 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Customer Overview"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={handleOpen}
                className="cursor-pointer gap-2"
              >
                <Eye className="h-4 w-4" />
                Customer History
              </DropdownMenuItem>
              {deliveryStatus && (
                <DropdownMenuItem asChild>
                  <a
                    href={`${config.courier_status_check_url}/${order?.courierDetails?.trackingId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Courier Status
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link
                  href={`https://wa.me/88${shipping?.phoneNumber}`}
                  target="_blank"
                  title="Whatsapp"
                  className="cursor-pointer gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Whatsapp
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommonModal
        open={open}
        handleOpen={handleOpen}
        modalTitle="Customer Order History"
        className="h-[95%] w-[100%] overflow-y-auto sm:h-[90%] xl:!w-[1100px]"
      >
        <FraudCheck phoneNumber={shipping?.phoneNumber} />
        <CustomerOrderHistory phoneNumber={shipping?.phoneNumber} />
      </CommonModal>
    </>
  );
};

export default CustomerInfo;

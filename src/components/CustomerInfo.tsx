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
import BdAddress from "@/lib/bdAddress";
import { TOrders } from "@/types/order.interface";
import { Eye, MapPin, MoreVertical, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CommonModal from "./modal/CommonModal";
import { Button } from "./ui/button";

const CustomerInfo = ({ order }: { order: TOrders }) => {
  const { shipping, deliveryStatus } = order || {};
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((prev) => !prev);

  const fullAddress = [
    shipping?.fullAddress,
    shipping?.upazila && BdAddress.upazilaNameById(shipping?.upazila).name,
    shipping?.district && BdAddress.districtNameById(shipping?.district).name,
    shipping?.division && BdAddress.divisionNameById(shipping?.division).name,
  ]
    .filter(Boolean)
    .join(", ");

  const locationLabel =
    BdAddress.districtNameById(shipping?.district).name ||
    shipping?.district ||
    shipping?.fullAddress ||
    "—";

  return (
    <>
      <div className="relative flex flex-col gap-1 min-w-0 text-left max-w-[220px] pr-7">
        <div
          className="flex items-center gap-1.5 min-w-0"
          title={shipping?.fullName}
        >
          <UserRound className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground capitalize line-clamp-1">
            {shipping?.fullName || "—"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <Phone className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          <span className="text-xs text-muted-foreground tabular-nums truncate">
            {shipping?.phoneNumber || "—"}
          </span>
        </div>
        <div className="flex items-start gap-1.5 min-w-0" title={fullAddress}>
          <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground mt-0.5" />
          <span className="text-xs text-muted-foreground line-clamp-2">
            {locationLabel}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              title="Customer Overview"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={handleOpen}
                className="gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                Customer History
              </DropdownMenuItem>
              {deliveryStatus && (
                <DropdownMenuItem asChild>
                  <a
                    href={`${config.courier_status_check_url}/${order?.courierDetails?.trackingId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    Courier Status
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link
                  href={`https://wa.me/88${shipping?.phoneNumber}`}
                  target="_blank"
                  title="Whatsapp"
                  className="gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
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
        className="h-[95%] sm:h-[90%] w-[100%] xl:!w-[1100px] overflow-y-auto"
      >
        <FraudCheck phoneNumber={shipping?.phoneNumber} />
        <CustomerOrderHistory phoneNumber={shipping?.phoneNumber} />
      </CommonModal>
    </>
  );
};

export default CustomerInfo;

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
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Eye, MapPin, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CommonModal from "./modal/CommonModal";
import BdAddress from "@/lib/bdAddress";

const CustomerInfo = ({ order }: { order: TOrders }) => {
  const { shipping: customer, deliveryStatus } = order || {};

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="capitalize flex flex-col mx-auto w-[140px] xl:w-[155px] 2xl:w-[170px] text-left">
        <div
          className="flex items-center gap-1 w-full"
          title={customer.fullName}
        >
          <UserRound className="w-4 shrink-0" />
          <span className="truncate">{customer.fullName}</span>
        </div>
        <div className="flex items-center gap-1 relative w-full">
          {/* <Link
            href={`https://wa.me/88${customer.phoneNumber}`}
            target="_blank"
            title="Whatsapp"
          ></Link> */}
          <Phone className="w-4 shrink-0" />
          <span className="truncate">{customer.phoneNumber}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span
                title="Customer Overview"
                className="p-2 cursor-pointer bg-gray-200 hover:bg-slate-300 rounded-full absolute -right-1"
              >
                <DotsVerticalIcon className="h-4 w-4" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <button
                    onClick={handleOpen}
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Customer History</span>
                  </button>
                </DropdownMenuItem>
                {deliveryStatus && (
                  <DropdownMenuItem>
                    <a
                      href={`${config.courier_status_check_url}/${order?.courierDetails?.trackingId}`}
                      target="_blank"
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Courier Status</span>
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Link
                    href={`https://wa.me/88${customer.phoneNumber}`}
                    target="_blank"
                    title="Whatsapp"
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Whatsapp</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div
          className="flex items-center gap-1 w-full"
          title={[
            customer.fullAddress,
            customer.upazila &&
              BdAddress.upazilaNameById(customer.upazila).name,
            customer.district &&
              BdAddress.districtNameById(customer.district).name,
            customer.division &&
              BdAddress.divisionNameById(customer.division).name,
          ]
            .filter(Boolean)
            .join(", ")}
        >
          <MapPin className="w-4 shrink-0" />
          <span className="truncate">
            {BdAddress.districtNameById(customer.district).name ||
              customer.fullAddress}
          </span>
        </div>
      </div>
      <CommonModal
        open={open}
        handleOpen={handleOpen}
        modalTitle="Customer Order History"
        className="h-[95%] sm:h-[90%] w-[100%] xl:!w-[1100px] overflow-y-auto"
      >
        <FraudCheck phoneNumber={customer.phoneNumber} />
        <CustomerOrderHistory phoneNumber={customer.phoneNumber} />
      </CommonModal>
    </>
  );
};

export default CustomerInfo;

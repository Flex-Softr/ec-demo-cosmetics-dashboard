"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MapPin, Phone, UserRound } from "lucide-react";
import CommonModal from "./modal/CommonModal";
import { useState } from "react";
import CustomerOrderHistory from "@/app/dashboard/orders/components/CustomerOrderHistory";
import { TOrders } from "@/types/order/order.interface";
import config from "@/config/config";
import Link from "next/link";
import FraudCheck from "@/app/dashboard/fraud-check/FraudCheck";
import { DotsVerticalIcon } from "@radix-ui/react-icons";

const CustomerInfo = ({ order }: { order: TOrders }) => {
  const { shipping: customer, deliveryStatus } = order || {};

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="capitalize flex flex-col mx-auto w-[155px]">
        <div className="flex items-center gap-1" title={customer.fullName}>
          <UserRound className="w-4" />
          <span>
            {customer.fullName.length > 15
              ? customer.fullName.slice(0, 15) + "..."
              : customer.fullName}
          </span>
        </div>
        <div className="flex items-center gap-1 relative">
          {/* <Link
            href={`https://wa.me/88${customer.phoneNumber}`}
            target="_blank"
            title="Whatsapp"
          ></Link> */}
          <Phone className="w-4" />
          <span>{customer.phoneNumber}</span>
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
                      href={`${config.courier_url}/${order?.courierDetails?.trackingId}`}
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
        <div className="flex items-center gap-1" title={customer.fullAddress}>
          <MapPin className="w-4" />
          <span>
            {customer.fullAddress.length > 15
              ? customer.fullAddress.slice(0, 15) + "..."
              : customer.fullAddress}
          </span>
        </div>
      </div>
      <CommonModal
        open={open}
        handleOpen={handleOpen}
        modalTitle="Customer Order History"
        className="h-[90%] !w-[1100px]"
      >
        <FraudCheck phoneNumber={customer.phoneNumber} />
        <CustomerOrderHistory phoneNumber={customer.phoneNumber} />
      </CommonModal>
    </>
  );
};

export default CustomerInfo;

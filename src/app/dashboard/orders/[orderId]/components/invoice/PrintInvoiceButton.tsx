"use client";

import { Button } from "@/components/ui/button";
import config from "@/config/config";
import { TOrders } from "@/types/order.interface";
import { Printer, ScissorsLineDashedIcon, UserRound } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import logo from "../../../../../../../public/logo.png";
import { InvoiceItemsTable } from "./InvoiceItemsTable";
import InvoiceSummary from "./InvoiceSummary";

const PrintInvoiceButton = ({ orders }: { orders: TOrders[] }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const order = orders?.[0];

  const invoiceId = order?.orderId || "invoice";
  const customerName =
    order?.shipping?.fullName?.replace(/[^a-zA-Z0-9]/g, "_") || "customer";
  // Format date: YYYY-MM-DD
  const dateStr = order?.createdAt
    ? new Date(order.createdAt).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `Invoice-${invoiceId}-${customerName}-${dateStr}`,
  });

  if (!order) return null;

  return (
    <>
      <Button
        size="sm"
        onClick={() => reactToPrintFn()}
        className="flex items-center gap-2 bg-primary text-white hover:bg-primary/95 border border-gray-300 dark:border-gray-800 px-3 py-1 rounded-md text-sm"
      >
        <Printer className="w-4 h-4" />
        <span>Print Invoice</span>
      </Button>

      {/* Hidden Print Content */}
      <div className="printContent" ref={contentRef}>
        {orders?.map((order) => {
          const { orderId, products, shipping, createdAt } = order;
          const {
            fullName,
            phoneNumber,
            fullAddress,
            division,
            district,
            upazila,
          } = shipping || {};

          const formattedAddress = [fullAddress, upazila, district, division]
            .filter(Boolean)
            .join(", ");

          return (
            <div
              key={orderId}
              className="bg-white text-black max-w-[210mm] mx-auto min-h-[297mm] flex flex-col font-sans break-after-page print:break-after-page"
              style={{ pageBreakAfter: "always" }}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-8 py-4 mb-3">
                <div>
                  <h1 className="text-4xl font-extrabold text-black tracking-tight uppercase">
                    Invoice
                  </h1>
                  <p className="text-sm text-black mt-1 font-medium">
                    <span className="text-black">Invoice No:</span> #{orderId}
                  </p>
                  <p className="text-sm text-black font-medium">
                    <span className="text-black">Date:</span>{" "}
                    {formatDate(createdAt)}
                  </p>
                </div>
                <Image
                  src={logo}
                  alt="Logo"
                  className="w-32 h-auto object-contain mix-blend-multiply"
                  priority
                  placeholder="blur"
                />
              </div>

              {/* Content Wrapper */}
              <div className="px-8 flex-grow">
                {/* Info Section */}
                <div className="grid grid-cols-2 gap-12 mb-4 items-start">
                  {/* Customer Info */}
                  <div className="space-y-1">
                    <h2 className="font-bold text-black border-b border-black/20 pb-1 flex items-center gap-2 text-base">
                      <UserRound className="w-4 h-4" /> Bill To
                    </h2>
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-black text-base">
                        {fullName}
                      </p>
                      <p className="text-black">{phoneNumber}</p>
                      <p className="leading-relaxed text-black">
                        {formattedAddress}
                      </p>
                    </div>
                  </div>

                  {/* Invoice Info */}
                  <div className="space-y-1">
                    <h2 className="font-bold text-black border-b border-black/20 pb-1 flex items-center gap-2 text-base">
                      <Printer className="w-4 h-4" /> From
                    </h2>
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-black text-base">
                        {config.company_info.name || "Nora Life Style"}
                      </p>
                      <p className="text-black">{config.company_info.phone}</p>
                      <p className="text-black">
                        {config.company_info.address || "Dhaka, Bangladesh"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Table */}
                <div className="mb-4">
                  <InvoiceItemsTable products={products ?? []} />
                </div>

                {/* Total Summary */}
                <div className="flex justify-end mb-6">
                  <InvoiceSummary order={order} />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto">
                <div className="px-8 pb-8">
                  <p className="text-center text-sm font-medium text-black mb-2">
                    Thank you for your business!
                  </p>
                  <p className="text-[11px] text-black text-center leading-relaxed max-w-lg mx-auto">
                    Please contact us at {config.company_info.phone} for any
                    queries.
                    <br />
                    This is a computer generated invoice and does not require a
                    signature.
                  </p>
                </div>

                {/* Cut Line */}
                <div className="flex items-center px-4 pb-4 opacity-50">
                  <ScissorsLineDashedIcon className="text-black w-4 h-4 mr-2 flex-shrink-0" />
                  <div className="border-t border-dashed border-gray-400 w-full" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

function formatDate(date: string | number | Date) {
  const d = new Date(date);
  const t = new Date(date).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();
  return `${day} ${month} ${year} at ${t}`;
}

export default PrintInvoiceButton;

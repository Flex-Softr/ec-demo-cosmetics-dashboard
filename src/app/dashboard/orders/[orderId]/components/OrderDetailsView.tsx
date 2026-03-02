"use client";

import DeleteOrderBtn from "@/components/DeleteOrderBtn";
import OrderIdAndDate from "@/components/OrderIdAndDate";
import UpdateOrderStatus from "@/components/UpdateOrderStatus";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/sectionTitle";
import { Separator } from "@/components/ui/separator";
import config from "@/config/config";
import { PERMISSIONS } from "@/const/permissions";
import BdAddress from "@/lib/bdAddress";
import { useGetSingleOrderQuery } from "@/redux/features/orders/ordersApi";
import { TOrders } from "@/types/order.interface";
import backgroundColor from "@/utilities/backgroundColor";
import isPermitted, { TPermission } from "@/utilities/isPermitted";
import {
  CreditCard,
  Edit,
  Loader2,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import OrderHistoryTable from "../../components/OrderHistoryTable";
import SchedulePickup from "../../components/SchedulePickup/SchedulePickup";
import { OrderedProductTable } from "./OrderedProductTable";
import SetOrderHistoryData from "./SetOrderHistoryData";
import PrintInvoiceButton from "./invoice/PrintInvoiceButton";

type OrderDetailsViewProps = {
  orderId: string;
  permissions: TPermission[];
};

const OrderDetailsView = ({ orderId, permissions }: OrderDetailsViewProps) => {
  const { data: response, isLoading } = useGetSingleOrderQuery(orderId);
  const order: TOrders = response?.data;
  const [openSchedulePickup, setOpenSchedulePickup] = useState(false);

  // Use permissions passed from server
  const editPermission = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_PROCESSING_ORDER
  );

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-red-500">
        Order not found
      </div>
    );
  }

  const {
    _id,
    orderId: displayOrderId,
    products,
    subtotal,
    shippingCharge,
    advance = 0,
    total,
    payment,
    discount,
    couponDiscount = 0,
    status,
    deliveryStatus,
    shipping,
    createdAt,
    invoiceNotes,
    officialNotes,
    courierNotes,
    monitoringNotes,
    orderNotes,
    reasonNotes,
  } = order;

  // const deliveryStatus = order?.statusFromShippingProvider;

  const edit = [
    "pending",
    "confirmed",
    "follow up",
    "processing",
    "warranty processing",
    "warranty added",
    "partial_delivered",
  ].includes(status);

  // const isEdit =
  //   edit ||
  //   (deliveryStatus === "partial_delivered" &&
  //     status !== "partial completed" &&
  //     editPermission)
  //     ? true
  //     : false;

  const isEdit = edit || editPermission;
  const isInvoice = [
    "processing",
    "warranty processing",
    "warranty added",
    "processing done",
  ].includes(status);

  const isDeleted = ["pending", "follow up"].includes(status);

  const totalNumberOfItems =
    products?.reduce((acc, item) => acc + (item?.quantity || 0), 0) || 0;

  const shippingCostExceptFirst = Number(
    (totalNumberOfItems - 1) * config.per_item_shipping_cost
  );

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 p-6 border-none shadow-sm">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            {/* Left Side: Order Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Order #{displayOrderId}
                </h1>
                <span
                  className={`capitalize px-2.5 py-0.5 text-sm font-medium text-white rounded ${backgroundColor(
                    deliveryStatus &&
                      status !== "partial completed" &&
                      status !== "returned"
                      ? deliveryStatus
                      : status
                  )}`}
                >
                  {deliveryStatus &&
                  status !== "partial completed" &&
                  status !== "returned"
                    ? deliveryStatus
                    : status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <span className="font-medium">Placed on:</span>
                <OrderIdAndDate
                  timestamp={createdAt}
                  className="inline-block space-x-4"
                />
              </div>
            </div>

            {/* Right Side: Actions */}
            <div className="flex flex-col items-start">
              <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4 items-center">
                <Button
                  onClick={() => setOpenSchedulePickup(true)}
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 px-3 py-1.5 rounded-md text-xs md:text-sm"
                >
                  Schedule Pickup
                </Button>
                {isEdit && (
                  <Link
                    href={`/dashboard/orders/${order._id}/edit`}
                    className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-3 py-1.5 rounded-md text-xs md:text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-1" />
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {/* Customer Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 border-b pb-2 mb-2 flex items-center gap-2">
                  <UserRound className="w-4 h-4" /> Customer Info
                </h3>
                <div className="space-y-2 text-sm font-medium text-gray-900">
                  <p>{shipping?.fullName}</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <Link
                      href={`https://wa.me/88${shipping.phoneNumber}`}
                      target="_blank"
                      className="hover:text-primary transition-colors hover:underline"
                    >
                      {shipping?.phoneNumber}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 border-b pb-2 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Shipping Area
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex justify-between gap-1">
                    <span className="text-muted-foreground">Method:</span>
                    <span className="font-medium text-gray-900">
                      {shippingCharge?.name}
                    </span>
                  </p>
                  <p className="flex justify-between gap-1">
                    <span className="text-muted-foreground">Charge:</span>
                    <span className="font-medium text-gray-900">
                      &#2547; {shippingCharge?.amount}
                      {shippingCostExceptFirst > 0 &&
                        ` + ${shippingCostExceptFirst}`}
                    </span>
                  </p>
                </div>
              </div>

              {/* Address - Full width of the first two columns */}
              <div className="md:col-span-2 text-sm font-medium text-gray-900">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="break-words">
                    {shipping?.fullAddress}
                    {shipping?.upazila &&
                      `, ${BdAddress.upazilaNameById(shipping?.upazila).name}`}
                    {shipping?.district &&
                      `, ${BdAddress.districtNameById(shipping?.district).name}`}
                    {shipping?.division &&
                      `, ${BdAddress.divisionNameById(shipping?.division).name}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 border-b pb-2 mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Payment Info
              </h3>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Method:</span>
                  <span className="font-medium text-gray-900">
                    {payment?.paymentMethod?.name}
                  </span>
                </p>
                {payment?.paymentDetails && (
                  <>
                    {Object.entries(payment.paymentDetails).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center text-sm gap-1"
                        >
                          <span className="capitalize text-muted-foreground">
                            {key}:
                          </span>
                          <span className="font-medium text-gray-900 text-right">
                            {value as ReactNode}
                          </span>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Courier Info */}
          {status === "On courier" && (
            <div className="pt-4 mt-2 border-t border-dashed">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    Delivery Status:
                  </span>
                  <span
                    className={`capitalize px-2 rounded text-[11px] font-medium text-white ${backgroundColor(order?.statusFromShippingProvider || "")}`}
                  >
                    {order?.statusFromShippingProvider
                      ?.replace("_", " ")
                      ?.replaceAll("-", " ")}
                  </span>
                </div>

                {order?.courierDetails && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Provider:</span>
                      <span className="font-medium text-gray-900">
                        {order.courierDetails?.courierProvider?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        Tracking ID:
                      </span>
                      <span className="font-medium text-gray-900">
                        {order.courierDetails?.trackingId}
                      </span>
                    </div>
                  </>
                )}

                {order?.messageFromShippingProvider && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Message:</span>
                    <span className="text-gray-600 italic">
                      {order.messageFromShippingProvider}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator className="mt-3 mb-6" />
          {/* Product Table */}
          <div className="rounded-lg border overflow-hidden">
            <OrderedProductTable products={products ? products : []} />
          </div>
          {/* Order Summary */}
          <div className="flex justify-end mt-3 gap-10">
            <div className="flex flex-col gap-2 justify-end">
              {isInvoice && <PrintInvoiceButton orders={[order]} />}
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 space-y-3 bg-gray-50/50 p-4 rounded-lg border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">&#2547; {subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-red-600">
                  - &#2547; {discount}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Coupon Discount</span>
                  <span className="font-medium text-red-600">
                    - &#2547; {couponDiscount}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  &#2547; {shippingCharge?.amount}
                  {shippingCostExceptFirst > 0 &&
                    ` + ${shippingCostExceptFirst}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Advance</span>
                <span className="font-medium text-green-600">
                  - &#2547; {advance}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>&#2547; {total}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="w-full lg:w-[350px] space-y-6">
          <Card className="p-5 border-none shadow-sm space-y-6 sticky top-4">
            <div className="space-y-3">
              <SectionTitle className="text-lg">Update Status</SectionTitle>
              <UpdateOrderStatus
                _id={_id as string}
                status={status}
                order={order}
                permissions={permissions}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Order Notes</h3>
              <div className="space-y-3">
                <NoteItem label="Customer Note" content={orderNotes} />
                <NoteItem label="Official Note" content={officialNotes} />
                <NoteItem label="Monitoring Note" content={monitoringNotes} />
                <NoteItem label="Courier Note" content={courierNotes} />
                {reasonNotes && (
                  <NoteItem label="Reason Note" content={reasonNotes} />
                )}
                <NoteItem label="Invoice Note" content={invoiceNotes} />
              </div>
            </div>

            {isDeleted && (
              <div className="pt-4 border-t">
                <DeleteOrderBtn
                  _id={_id as string}
                  variant="destructive"
                  className="w-[150px]"
                >
                  Delete Order
                </DeleteOrderBtn>
              </div>
            )}
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-center mb-2">Order History</h2>
        <Card className="p-6 pt-0 border-none shadow-sm">
          <SetOrderHistoryData searchQuery={shipping?.phoneNumber} />
          <div className="mt-4">
            <OrderHistoryTable permissions={permissions} />
          </div>
        </Card>
      </div>

      <SchedulePickup
        open={openSchedulePickup}
        handleOpen={() => setOpenSchedulePickup(!openSchedulePickup)}
        order={order}
      />
    </div>
  );
};

// Helper component for notes
const NoteItem = ({
  label,
  content,
}: {
  label: string;
  content: string | undefined;
}) => (
  <div>
    <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
    <div className="min-h-12 border border-dashed rounded-md p-3 text-sm bg-gray-50/50 text-gray-700 whitespace-pre-wrap break-words">
      {content}
    </div>
  </div>
);

export default OrderDetailsView;

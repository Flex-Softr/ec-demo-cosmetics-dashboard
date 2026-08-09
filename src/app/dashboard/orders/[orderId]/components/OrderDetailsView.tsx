"use client";

import DeleteOrderBtn from "@/components/DeleteOrderBtn";
import OrderIdAndDate from "@/components/OrderIdAndDate";
import UpdateOrderStatus from "@/components/UpdateOrderStatus";
import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import OrderDetailsSkeleton from "@/components/skeleton/OrderDetailsSkeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import config from "@/config/config";
import { PERMISSIONS } from "@/const/permissions";
import BdAddress from "@/lib/bdAddress";
import { useGetSingleOrderQuery } from "@/redux/features/orders/ordersApi";
import { TOrders } from "@/types/order.interface";
import backgroundColor from "@/utilities/backgroundColor";
import isPermitted, { TPermission } from "@/utilities/isPermitted";
import {
  ArrowLeft,
  CreditCard,
  Edit,
  Mail,
  MapPin,
  Phone,
  ShoppingCart,
  Truck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import SchedulePickup from "../../components/SchedulePickup/SchedulePickup";
import AllOrdersTable from "../../components/AllOrdersTable";
import { OrderedProductTable } from "./OrderedProductTable";
import SetOrderHistoryData from "./SetOrderHistoryData";
import PrintInvoiceButton from "./invoice/PrintInvoiceButton";
import { useRouter } from "next/navigation";

type OrderDetailsViewProps = {
  orderId: string;
  permissions: TPermission[];
};

const OrderDetailsView = ({ orderId, permissions }: OrderDetailsViewProps) => {
  const router = useRouter();
  const { data: response, isLoading } = useGetSingleOrderQuery(orderId);
  const order: TOrders = response?.data;
  const [openSchedulePickup, setOpenSchedulePickup] = useState(false);

  // Use permissions passed from server
  const editPermission = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_PROCESSING_ORDER
  );

  if (isLoading) {
    return <OrderDetailsSkeleton />;
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
    "on courier",
  ].includes(status);

  const isDeleted = ["pending", "follow up"].includes(status);

  const totalNumberOfItems =
    products?.reduce((acc, item) => acc + (item?.quantity || 0), 0) || 0;

  const shippingCostExceptFirst = Number(
    (totalNumberOfItems - 1) * config.per_item_shipping_cost
  );

  return (
    <div className="mb-8 space-y-5 p-4 sm:p-6">
      <PageHeader
        title={`Order #${displayOrderId}`}
        subtitle="View order details, status, and history"
        icon={ShoppingCart}
        actions={
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5"
          >
            <Link href="/dashboard/orders">View All</Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-5 lg:flex-row">
        <ContentCard className="min-w-0 flex-1 lg:w-[70%]">
          {/* Header Section */}
          <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row">
            {/* Left Side: Order Info */}
            <div className="w-full space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-8 w-8 rounded-lg border-border sm:h-9 sm:w-9"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-base font-semibold text-foreground sm:text-lg">
                    Order #{displayOrderId}
                  </h2>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize text-white ${backgroundColor(
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
              <div className="ml-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                <span className="font-medium whitespace-nowrap">
                  Placed on:
                </span>
                <OrderIdAndDate
                  timestamp={createdAt}
                  className="inline-block space-x-2"
                />
                <span className="truncate">{order?.orderSource?.name}</span>
              </div>
            </div>

            {/* Right Side: Actions */}
            <div className="flex w-full shrink-0 flex-row items-center gap-2 sm:w-auto sm:gap-2">
              {status === "processing done" && (
                <Button
                  onClick={() => setOpenSchedulePickup(true)}
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-lg text-xs sm:h-9"
                >
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Pickup</span>
                </Button>
              )}
              {isEdit && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-lg text-xs sm:h-9"
                >
                  <Link href={`/dashboard/orders/${order._id}/edit`}>
                    <Edit className="h-4 w-4 text-primary" />
                    <span>Edit</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <Separator className="my-3" />
          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:col-span-2 md:grid-cols-2">
              {/* Customer Info */}
              <div className="space-y-3">
                <h3 className="mb-2 flex items-center gap-2 border-b border-border pb-2 text-sm font-semibold text-foreground">
                  <UserRound className="h-4 w-4 text-primary" /> Customer Info
                </h3>
                <div className="space-y-2 text-sm font-medium text-foreground">
                  <p>{shipping?.fullName}</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Link
                      href={`https://wa.me/88${shipping.phoneNumber}`}
                      target="_blank"
                      className="transition-colors hover:text-primary hover:underline"
                    >
                      {shipping?.phoneNumber}
                    </Link>
                  </div>
                  {shipping?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p>{shipping?.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="space-y-3">
                <h3 className="mb-2 flex items-center gap-2 border-b border-border pb-2 text-sm font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-primary" /> Shipping Area
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex justify-between gap-1">
                    <span>Method:</span>
                    <span className="font-medium text-foreground">
                      {shippingCharge?.name}
                    </span>
                  </p>
                  <p className="flex justify-between gap-1">
                    <span>Charge:</span>
                    <span className="font-medium text-foreground">
                      &#2547; {shippingCharge?.amount}
                      {shippingCostExceptFirst > 0 &&
                        ` + ${shippingCostExceptFirst}`}
                    </span>
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="text-sm font-medium text-foreground md:col-span-2">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="break-words">
                    {[
                      shipping.fullAddress,
                      shipping.upazila &&
                        BdAddress.upazilaNameById(shipping.upazila).name,
                      shipping.district &&
                        BdAddress.districtNameById(shipping.district).name,
                      shipping.division &&
                        BdAddress.divisionNameById(shipping.division).name,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-3">
              <h3 className="mb-2 flex items-center gap-2 border-b border-border pb-2 text-sm font-semibold text-foreground">
                <CreditCard className="h-4 w-4 text-primary" /> Payment Info
              </h3>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Method:</span>
                  <span className="font-medium text-foreground">
                    {payment?.paymentMethod?.name}
                  </span>
                </p>
                {payment?.paymentDetails && (
                  <>
                    {Object.entries(payment.paymentDetails).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-1 text-sm"
                        >
                          <span className="capitalize text-muted-foreground">
                            {key}:
                          </span>
                          <span className="text-right font-medium text-foreground">
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
          {(order?.deliveryStatus ||
            order.courierDetails?.courierProvider?.name) && (
            <div className="mt-2 border-t border-dashed border-border pt-4">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    Delivery Status:
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize text-white ${backgroundColor(order?.deliveryStatus || "")}`}
                  >
                    {order?.deliveryStatus
                      ?.replace("_", " ")
                      ?.replaceAll("-", " ")}
                  </span>
                </div>

                {order?.courierDetails && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Courier:</span>
                      <span className="font-medium text-foreground">
                        {order.courierDetails?.courierProvider?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        Tracking ID:
                      </span>
                      <span className="font-medium text-foreground">
                        {order.courierDetails?.trackingId}
                      </span>
                    </div>
                  </>
                )}

                {order?.deliveryMessage && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Message:</span>
                    <span className="italic text-muted-foreground">
                      {order.deliveryMessage}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator className="mb-6 mt-3" />
          {/* Product Table */}
          <div className="overflow-hidden rounded-xl border border-border">
            <OrderedProductTable products={products ? products : []} />
          </div>
          {/* Order Summary */}
          <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row">
            <div className="order-2 flex w-full flex-col justify-end gap-2 sm:order-1 sm:w-auto">
              {isInvoice && (
                <div className="w-full sm:w-auto">
                  <PrintInvoiceButton orders={[order]} />
                </div>
              )}
            </div>
            <div className="order-1 w-full space-y-3 rounded-xl border border-border bg-muted/40 p-4 sm:order-2 sm:w-1/2 lg:w-1/3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">&#2547; {subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-destructive">
                  - &#2547; {discount}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Coupon Discount</span>
                  <span className="font-medium text-destructive">
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
                <span className="font-medium text-emerald-600">
                  - &#2547; {advance}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span>&#2547; {total}</span>
              </div>
            </div>
          </div>
        </ContentCard>

        {/* Sidebar */}
        <div className="w-full space-y-5 lg:w-[30%]">
          <ContentCard className="sticky top-4 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Update Status
              </h3>
              <Separator className="mb-3 mt-2" />
              <div>
                <UpdateOrderStatus
                  _id={_id as string}
                  status={status}
                  order={order}
                  permissions={permissions}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                Order Notes
              </h3>
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
              <div className="border-t border-border pt-4">
                <DeleteOrderBtn
                  _id={_id as string}
                  variant="destructive"
                  className="w-[150px] rounded-lg"
                >
                  Delete Order
                </DeleteOrderBtn>
              </div>
            )}
          </ContentCard>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-center text-lg font-semibold text-foreground">
          Order History
        </h2>
        <ContentCard>
          <SetOrderHistoryData searchQuery={shipping?.phoneNumber} />
          <div className="mt-4">
            <AllOrdersTable permissions={permissions} showPagination />
          </div>
        </ContentCard>
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
    <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
    <div className="min-h-12 whitespace-pre-wrap break-words rounded-lg border border-dashed border-border bg-muted/40 p-3 text-sm text-foreground">
      {content}
    </div>
  </div>
);

export default OrderDetailsView;

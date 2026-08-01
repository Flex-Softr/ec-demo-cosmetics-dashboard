"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetSingleCustomerQuery } from "@/redux/features/customer/customerApi";
import { TCustomer } from "@/redux/features/customer/customerInterface";
import { cn } from "@/lib/utils";
import { TPermission } from "@/utilities/isPermitted";
import { format, formatDistanceToNow } from "date-fns";
import OrderHistoryTable from "../../orders/[orderId]/components/SetOrderHistoryData";
import AllOrdersTable from "../../orders/components/AllOrdersTable";

const statusTone: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  banned: "bg-red-50 text-red-700",
  deleted: "bg-slate-100 text-slate-600",
};

const DetailRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex border-b border-border py-2 last:border-b-0">
    <span className="w-32 shrink-0 text-sm font-medium text-muted-foreground">
      {label}
    </span>
    <div className="text-sm text-foreground">{children}</div>
  </div>
);

const CustomerDetailsView = ({
  id,
  permissions,
}: {
  id: string;
  permissions: TPermission[];
}) => {
  const { data, isLoading, isError } = useGetSingleCustomerQuery(id);

  if (isLoading) {
    return (
      <div className="space-y-5 p-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Skeleton className="h-[280px] w-full rounded-xl" />
          <Skeleton className="h-[280px] w-full rounded-xl" />
        </div>
        <Skeleton className="h-[360px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex h-40 items-center justify-center text-sm font-medium text-destructive">
        No customer found
      </div>
    );
  }

  const customer = data.data as TCustomer;

  return (
    <div className="space-y-5 p-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 border-b border-border pb-2 text-base font-semibold text-foreground">
            Customer Information
          </h2>
          <div className="space-y-1">
            <DetailRow label="Name">{customer.name}</DetailRow>
            <DetailRow label="UID">{customer.uid}</DetailRow>
            <DetailRow label="Phone">{customer.phoneNumber}</DetailRow>
            <DetailRow label="Email">{customer.email || "—"}</DetailRow>
            <DetailRow label="Status">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                  statusTone[customer.status] ||
                    "bg-muted text-muted-foreground"
                )}
              >
                {customer.status}
              </span>
            </DetailRow>
            <DetailRow label="Registered At">
              <div className="flex flex-col">
                <span>
                  {customer.createdAt
                    ? format(
                        new Date(customer.createdAt),
                        "dd MMM yyyy, hh:mm a"
                      )
                    : "—"}
                </span>
                {customer.createdAt && (
                  <span className="text-xs text-muted-foreground">
                    (
                    {formatDistanceToNow(new Date(customer.createdAt), {
                      addSuffix: true,
                    })}
                    )
                  </span>
                )}
              </div>
            </DetailRow>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 border-b border-border pb-2 text-base font-semibold text-foreground">
            Shipping Address
          </h2>
          {customer.shipping ? (
            <div className="space-y-1">
              <DetailRow label="Full Name">
                {customer.shipping.fullName}
              </DetailRow>
              <DetailRow label="Phone">
                {customer.shipping.phoneNumber}
              </DetailRow>
              {customer.shipping.email ? (
                <DetailRow label="Email">{customer.shipping.email}</DetailRow>
              ) : null}
              <DetailRow label="Address">
                {customer.shipping.fullAddress}
              </DetailRow>
              <DetailRow label="Thana / Upazila">
                {customer.shipping.upazila}
              </DetailRow>
              <DetailRow label="District">
                {customer.shipping.district}
              </DetailRow>
              <DetailRow label="Division">
                {customer.shipping.division}
              </DetailRow>
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-sm italic text-muted-foreground">
              No shipping address found
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="mb-4 border-b border-border pb-2 text-base font-semibold text-foreground">
          Orders
        </h4>
        <div className="space-y-8">
          <div>
            <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Order History / Activities
            </h5>
            <OrderHistoryTable userId={customer._id} />
          </div>
          <div>
            <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              All Orders List
            </h5>
            <AllOrdersTable permissions={permissions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsView;

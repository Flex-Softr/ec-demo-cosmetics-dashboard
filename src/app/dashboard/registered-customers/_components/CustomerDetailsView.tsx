"use client";

import { Card } from "@/components/ui/card";
import { useGetSingleCustomerQuery } from "@/redux/features/customer/customerApi";
import { TCustomer } from "@/redux/features/customer/customerInterface";
import backgroundColor from "@/utilities/backgroundColor";
import { format, formatDistanceToNow } from "date-fns";
import OrderHistoryTable from "../../orders/[orderId]/components/SetOrderHistoryData";
import AllOrdersTable from "../../orders/components/AllOrdersTable";
import { Skeleton } from "@/components/ui/skeleton";
import { TPermission } from "@/utilities/isPermitted";

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
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <h2 className="text-center font-bold py-10 text-destructive">
        No customer found
      </h2>
    );
  }

  const customer = data.data as TCustomer;

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">
            Customer Information
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex border-b pb-1">
              <span className="font-semibold w-32 shrink-0">Name:</span>
              <span>{customer.name}</span>
            </div>
            <div className="flex border-b pb-1">
              <span className="font-semibold w-32 shrink-0">UID:</span>
              <span>{customer.uid}</span>
            </div>
            <div className="flex border-b pb-1">
              <span className="font-semibold w-32 shrink-0">Phone:</span>
              <span>{customer.phoneNumber}</span>
            </div>
            <div className="flex border-b pb-1">
              <span className="font-semibold w-32 shrink-0">Email:</span>
              <span>{customer.email || "N/A"}</span>
            </div>
            <div className="flex border-b pb-1">
              <span className="font-semibold w-32 shrink-0">Status:</span>
              <span
                className={`${backgroundColor(customer.status)} capitalize px-2 py-0.5 rounded text-xs font-medium`}
              >
                {customer.status}
              </span>
            </div>
            <div className="flex border-b pb-1">
              <span className="font-semibold w-32 shrink-0">
                Registered At:
              </span>
              <div className="flex flex-col">
                <span>
                  {customer.createdAt
                    ? format(
                        new Date(customer.createdAt),
                        "dd MMM yyyy, hh:mm a"
                      )
                    : "N/A"}
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
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">
            Shipping Address
          </h2>
          {customer.shipping ? (
            <div className="space-y-3 text-sm">
              <div className="flex border-b pb-1">
                <span className="font-semibold w-32 shrink-0">Full Name:</span>
                <span>{customer.shipping.fullName}</span>
              </div>
              <div className="flex border-b pb-1">
                <span className="font-semibold w-32 shrink-0">Phone:</span>
                <span>{customer.shipping.phoneNumber}</span>
              </div>
              {customer.shipping.email && (
                <div className="flex border-b pb-1">
                  <span className="font-semibold w-32 shrink-0">Email:</span>
                  <span>{customer.shipping.email}</span>
                </div>
              )}
              <div className="flex border-b pb-1">
                <span className="font-semibold w-32 shrink-0">Address:</span>
                <span>{customer.shipping.fullAddress}</span>
              </div>
              <div className="flex border-b pb-1">
                <span className="font-semibold w-32 shrink-0">Upazila:</span>
                <span>{customer.shipping.upazila}</span>
              </div>
              <div className="flex border-b pb-1">
                <span className="font-semibold w-32 shrink-0">District:</span>
                <span>{customer.shipping.district}</span>
              </div>
              <div className="flex border-b pb-1">
                <span className="font-semibold w-32 shrink-0">Division:</span>
                <span>{customer.shipping.division}</span>
              </div>
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-muted-foreground italic">
              No shipping address found
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h4 className="text-lg font-bold mb-4 border-b pb-2">Orders</h4>
        <div className="space-y-8">
          <div>
            <h5 className="font-semibold mb-3 text-muted-foreground uppercase text-xs tracking-wider">
              Order History/Activities
            </h5>
            <OrderHistoryTable userId={customer._id} />
          </div>
          <div>
            <h5 className="font-semibold mb-3 text-muted-foreground uppercase text-xs tracking-wider">
              All Orders List
            </h5>
            <AllOrdersTable permissions={permissions} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomerDetailsView;

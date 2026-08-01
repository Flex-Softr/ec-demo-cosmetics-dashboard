"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useGetRecentOrdersQuery } from "@/redux/features/dashboard/dashboardApi";
import Link from "next/link";

const statusColor = (status: string) => {
  if (status === "completed" || status === "partial completed") {
    return "bg-green-500/10 text-green-600";
  }
  if (status === "canceled" || status === "returned") {
    return "bg-red-500/10 text-red-500";
  }
  if (status === "pending" || status === "follow up") {
    return "bg-amber-500/10 text-amber-600";
  }
  return "bg-blue-500/10 text-blue-600";
};

const RecentOrders = () => {
  const { data: recentOrdersRes, isLoading } = useGetRecentOrdersQuery();
  const recentOrders = recentOrdersRes?.data ?? [];

  return (
    <div className="rounded-xl border bg-white/50 backdrop-blur-sm overflow-hidden">
      <div className="px-5 py-4 border-b">
        <p className="text-sm font-semibold text-gray-900">Recent Orders</p>
        <p className="text-xs text-gray-500 mt-0.5">Latest incoming orders</p>
      </div>
      <div className="p-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-gray-500 text-xs uppercase tracking-wide px-5">
                Invoice
              </TableHead>
              <TableHead className="text-gray-500 text-xs uppercase tracking-wide">
                Customer
              </TableHead>
              <TableHead className="text-gray-500 text-xs uppercase tracking-wide">
                Phone
              </TableHead>
              <TableHead className="text-gray-500 text-xs uppercase tracking-wide">
                Status
              </TableHead>
              <TableHead className="text-gray-500 text-xs uppercase tracking-wide text-right px-5">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="px-5">
                      <Skeleton className="w-20 h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-24 h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-20 h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-16 h-5 rounded-full" />
                    </TableCell>
                    <TableCell className="px-5">
                      <Skeleton className="w-14 h-4 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              : recentOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/40">
                    <TableCell className="px-5">
                      <Link
                        className="text-primary hover:underline text-sm font-medium"
                        href={`/dashboard/orders/${order.id}`}
                      >
                        {order.invoice_no || "N/A"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-gray-900 text-sm">
                      {order.customer_name || "-"}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {order.customer_phone || "-"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                          statusColor(order.status)
                        )}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 text-right text-sm font-medium text-gray-900">
                      ৳{order.grand_total.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentOrders;

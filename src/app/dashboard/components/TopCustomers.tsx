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
import { useGetTopCustomersQuery } from "@/redux/features/dashboard/dashboardApi";

const TopCustomers = () => {
  const { data: topCustomersRes, isLoading } = useGetTopCustomersQuery();
  const topCustomers = topCustomersRes?.data;

  return (
    <div className="rounded-xl border bg-white/50 backdrop-blur-sm overflow-hidden">
      <div className="px-5 py-4 border-b">
        <p className="text-sm font-semibold text-gray-900">Top Customers</p>
        <p className="text-xs text-gray-500 mt-0.5">
          Customers with the highest orders
        </p>
      </div>
      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-gray-500 text-xs uppercase tracking-wide px-5">
                Name
              </TableHead>
              <TableHead className="text-gray-500 text-xs uppercase tracking-wide">
                Mobile
              </TableHead>
              <TableHead className="text-gray-500 text-xs uppercase tracking-wide text-right px-5">
                Orders
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="px-5">
                      <Skeleton className="w-28 h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-24 h-4" />
                    </TableCell>
                    <TableCell className="px-5 flex justify-end">
                      <Skeleton className="w-8 h-4" />
                    </TableCell>
                  </TableRow>
                ))
              : topCustomers?.map((customer) => (
                  <TableRow
                    key={customer?.customer_id}
                    className="hover:bg-muted/40"
                  >
                    <TableCell className="px-5 font-medium text-gray-900">
                      {customer?.customer?.name || "-"}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {customer?.customer?.phone || "-"}
                    </TableCell>
                    <TableCell className="px-5 text-right">
                      <span className="inline-flex items-center justify-center h-6 min-w-[1.5rem] px-2 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {customer?.order_count}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TopCustomers;

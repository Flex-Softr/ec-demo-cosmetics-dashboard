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
import { useGetCustomerOrderHistoryQuery } from "@/redux/features/orders/ordersApi";
import backgroundColor from "@/utilities/backgroundColor";

const CustomerOrderHistory = ({ phoneNumber }: { phoneNumber: string }) => {
  const { data: orderHistory, isLoading } =
    useGetCustomerOrderHistoryQuery(phoneNumber);

  if (isLoading) {
    return (
      <div className="space-y-2 pt-2">
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full rounded-md" />
          ))}
        </div>
        {Array.from({ length: 3 }).map((_, row) => (
          <div key={row} className="grid grid-cols-8 gap-2">
            {Array.from({ length: 8 }).map((_, col) => (
              <Skeleton key={col} className="h-7 w-full rounded-md" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const rows =
    orderHistory?.data?.reduce(
      (
        acc: { name: string; total: number }[][],
        status: { name: string; total: number },
        index: number
      ) => {
        if (index % 4 === 0) acc.push([]);
        acc[acc.length - 1].push(status);
        return acc;
      },
      []
    ) ?? [];

  return (
    <div className="pt-2">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 hover:bg-gray-100">
            <TableHead className="border border-gray-300 font-semibold">
              Status
            </TableHead>
            <TableHead className="border border-gray-300 font-semibold">
              Count
            </TableHead>
            <TableHead className="border border-gray-300 font-semibold">
              Status
            </TableHead>
            <TableHead className="border border-gray-300 font-semibold">
              Count
            </TableHead>
            <TableHead className="border border-gray-300 font-semibold">
              Status
            </TableHead>
            <TableHead className="border border-gray-300 font-semibold">
              Count
            </TableHead>
            <TableHead className="border border-gray-300 font-semibold">
              Status
            </TableHead>
            <TableHead className="border border-gray-300 font-semibold">
              Count
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(
            (row: { name: string; total: number }[], rowIndex: number) => (
              <TableRow key={rowIndex}>
                {row.map(({ name, total }: { name: string; total: number }) => {
                  const bg =
                    total > 0 ? `${backgroundColor(name)} text-white` : "";
                  return (
                    <>
                      <TableCell
                        key={`${name}-name`}
                        className={`border border-gray-300 capitalize ${bg}`}
                      >
                        {name}
                      </TableCell>
                      <TableCell
                        key={`${name}-count`}
                        className={`border border-gray-300 ${bg}`}
                      >
                        ({total})
                      </TableCell>
                    </>
                  );
                })}
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerOrderHistory;

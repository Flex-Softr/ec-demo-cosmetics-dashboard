"use client";
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
      <div
        role="status"
        className="w-full h-16 bg-gray-300 animate-pulse dark:bg-gray-700 rounded"
      ></div>
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

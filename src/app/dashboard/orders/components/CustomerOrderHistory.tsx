"use client";
import { useGetCustomerOrderHistoryQuery } from "@/redux/features/orders/ordersApi";
import backgroundColor from "@/utilities/backgroundColor";

const CustomerOrderHistory = ({ phoneNumber }: { phoneNumber: string }) => {
  const { data: orderHistory, isLoading } =
    useGetCustomerOrderHistoryQuery(phoneNumber);

  if (isLoading) {
    return (
      <div
        role="status"
        className="w-full h-[calc(100vh-60px)] bg-gray-300 animate-pulse dark:bg-gray-700 z-10"
      ></div>
    );
  }

  return (
    <table className="min-w-[1000px] border-collapse border border-gray-300 shadow-lg">
      {/* Table Header */}
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="border border-gray-300 px-4 py-2">Status</th>
          <th className="border border-gray-300 px-4 py-2">Count</th>
          <th className="border border-gray-300 px-4 py-2">Status</th>
          <th className="border border-gray-300 px-4 py-2">Count</th>
          <th className="border border-gray-300 px-4 py-2">Status</th>
          <th className="border border-gray-300 px-4 py-2">Count</th>
          <th className="border border-gray-300 px-4 py-2">Status</th>
          <th className="border border-gray-300 px-4 py-2">Count</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody>
        {orderHistory?.data
          ?.reduce(
            (
              rows: { name: string; total: number }[][],
              status: { name: string; total: number },
              index: number
            ) => {
              // Group items into sets of 4 statuses per row
              if (index % 4 === 0) {
                rows.push([]);
              }
              rows[rows.length - 1].push(status);
              return rows;
            },
            [] as { name: string; total: number }[][]
          )
          .map((row: { name: string; total: number }[], rowIndex: number) => (
            <tr key={rowIndex} className="border border-gray-300 ">
              {row.map(({ name, total }: { name: string; total: number }) => {
                const bg =
                  total > 0 ? `${backgroundColor(name)} text-white` : "";
                return (
                  <>
                    <td className={`px-4 py-2 capitalize ${bg}`}>{name}</td>
                    <td className={`px-4 py-2 border-r border-gray-300 ${bg}`}>
                      ({total})
                    </td>
                  </>
                );
              })}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default CustomerOrderHistory;

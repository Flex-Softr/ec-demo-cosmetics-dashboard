"use client";
import { PagePagination } from "@/components/pagination/PagePagination";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { setBulkOrder } from "@/redux/features/courierManagement/courierManagementSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { TOrders } from "@/types/order/order.interface";
import formattedOrderData from "@/utilities/formattedOrderData";
import {
  // ColumnDef,
  flexRender,
  getCoreRowModel,
  // getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect } from "react";
import { columns } from "./OrdersColumn";
// import ReasonNotes from "./ReasonNotes";

export default function OrdersTable() {
  const dispatch = useAppDispatch();

  const { isLoading } = useAppSelector(({ pagination }) => pagination);
  const orders = useAppSelector(({ search, courierManagement }) => {
    return search.search
      ? search.searchedOrders
      : courierManagement.processingDoneOrders;
  });
  const search = useAppSelector(({ search }) => {
    return search.search;
  });

  const table = useReactTable({
    data: orders,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedRows = table?.getFilteredSelectedRowModel()?.rows;
  const selectedOrders = formattedOrderData(selectedRows);

  useEffect(() => {
    dispatch(setBulkOrder(selectedOrders));
  }, [selectedOrders, dispatch]);

  return (
    <div className="w-full">
      <div className="rounded-md border overflow-hidden">
        <Table className="min-w-[1100px]">
          <TableHeader className="bg-primary text-white">
            {table?.getHeaderGroups()?.map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-muted/0">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table?.getRowModel()?.rows?.length ? (
              table?.getRowModel()?.rows?.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <TableSkeleton />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No orders
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!search && (
        <div className="flex items-center justify-end space-x-2 py-2">
          <PagePagination />
        </div>
      )}
    </div>
  );
}

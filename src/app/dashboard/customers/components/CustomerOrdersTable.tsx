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
import { setBulkOrder } from "@/redux/features/completedOrders/completedOrdersSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TPermission } from "@/utilities/isPermitted";
import formattedOrderData from "@/utilities/formattedOrderData";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { getColumns } from "./CustomerOrdersColumn";

export default function CustomerOrdersTable({
  permissions,
}: {
  permissions: TPermission[];
}) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(({ pagination }) => pagination);

  const orders = useAppSelector(({ completedOrders, search }) => {
    return search.search
      ? search.searchedOrders
      : completedOrders.completedOrders;
  });
  const search = useAppSelector(({ search }) => {
    return search.search;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => getColumns(permissions), [permissions]);

  const table = useReactTable({
    data: orders,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRows = table?.getFilteredSelectedRowModel()?.rows;
  const selectedOrders = formattedOrderData(selectedRows);

  useEffect(() => {
    dispatch(setBulkOrder(selectedOrders));
  }, [selectedOrders, dispatch]);

  return (
    <div className="w-full space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table className="min-w-[1100px] whitespace-nowrap">
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-border hover:bg-muted"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-border"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 text-center">
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
                    className="h-24 text-center text-muted-foreground"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {!search && (
        <div className="flex items-center justify-end py-1">
          <PagePagination />
        </div>
      )}
    </div>
  );
}

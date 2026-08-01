"use client";
import { PagePagination } from "@/components/pagination/PagePagination";
import OrdersTableSkeleton from "@/components/skeleton/OrdersTableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { setBulkOrder } from "@/redux/features/processingOrders/processingOrdersSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import formattedOrderData from "@/utilities/formattedOrderData";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { getColumns } from "./ProcessingOrdersColumn";
import { TPermission } from "@/utilities/isPermitted";

export default function ProcessingOrdersTable({
  permissions,
}: {
  permissions: TPermission[];
}) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(({ pagination }) => pagination);

  const orders = useAppSelector(({ processingOrders, search }) => {
    return search.search
      ? search.searchedOrders
      : processingOrders.processingOrders;
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
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table className="min-w-[1100px]">
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border hover:bg-muted"
              >
                {headerGroup.headers.map((header) => {
                  return (
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <OrdersTableSkeleton columns={columns.length} />
            ) : table.getRowModel().rows?.length ? (
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
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No orders
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!search && (
        <div className="flex items-center justify-end py-1">
          <PagePagination />
        </div>
      )}
    </div>
  );
}

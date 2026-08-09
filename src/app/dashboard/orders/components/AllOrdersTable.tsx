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
import {
  softTableCellClass,
  softTableHeadClass,
  softTableHeaderClass,
  softTableRowClass,
  softTableWrapperClass,
} from "@/lib/tableStyles";
import { setBulkOrder } from "@/redux/features/orders/ordersSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TOrders } from "@/types/order.interface";
import formattedOrderData from "@/utilities/formattedOrderData";
import { TPermission } from "@/utilities/isPermitted";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { getColumns } from "./AllOrdersColumn";
import FollowUpDate from "./FollowUpDate";

export default function AllOrdersTable({
  permissions,
  showPagination,
}: {
  permissions: TPermission[];
  showPagination?: boolean;
}) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(({ pagination }) => pagination);

  const status = useAppSelector(({ orders }) => orders.selectedStatus);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => getColumns(permissions), [permissions]);

  const newColumns: ColumnDef<TOrders>[] = useMemo(
    () =>
      status === "follow up"
        ? [
            ...columns.slice(0, 8),
            {
              accessorKey: "followUpDate",
              header: "Follow up",
              cell: ({ row }) => <FollowUpDate order={row.original} />,
            },
            ...columns.slice(8),
          ]
        : [...columns],
    [status, columns]
  );

  const orders = useAppSelector(({ orders, search }) =>
    search.search ? search.searchedOrders : orders.orders
  );
  const search = useAppSelector(({ search }) => search.search);
  const shouldShowPagination =
    typeof showPagination === "boolean" ? showPagination : !search;

  const table = useReactTable({
    data: orders,
    columns: newColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRows = table?.getFilteredSelectedRowModel()?.rows;
  const selectedOrders = formattedOrderData(selectedRows);

  useEffect(() => {
    dispatch(setBulkOrder(selectedOrders));
  }, [selectedOrders, dispatch]);

  return (
    <div className="w-full space-y-3">
      <div className={softTableWrapperClass}>
        <Table className="min-w-[1200px]">
          <TableHeader className={softTableHeaderClass}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border hover:bg-muted"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={softTableHeadClass}>
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
            {isLoading ? (
              <OrdersTableSkeleton columns={newColumns.length} />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={softTableRowClass}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={softTableCellClass}>
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
                  colSpan={newColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No orders
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {shouldShowPagination && (
        <div className="flex items-center justify-end py-1">
          <PagePagination />
        </div>
      )}
    </div>
  );
}

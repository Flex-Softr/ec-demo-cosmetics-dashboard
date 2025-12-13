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
import {
  setBulkOrder,
  setEditPermission,
} from "@/redux/features/monitorDelivery/monitorDeliverySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { TOrders } from "@/types/order/order.interface";
import formattedOrderData from "@/utilities/formattedOrderData";
import {
  ColumnDef,
  // ColumnDef,
  flexRender,
  getCoreRowModel,
  // getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect } from "react";
import { columns } from "./OrdersColumn";
import { TOrders } from "@/types/order/order.interface";
import OrderStatus from "@/components/OrderStatus";
import MonitoringAndTracking from "./MonitoringAndTracking";
// import ReasonNotes from "./ReasonNotes";
// import { useCallback,useState ,useRef } from "react";

export default function OrdersTable({
  editPermission,
}: {
  editPermission: boolean;
}) {
  const dispatch = useAppDispatch();

  const newColumns: ColumnDef<TOrders>[] = [
    ...columns.slice(0, 8),
    {
      accessorKey: "status",
      header: "Delivery",
      cell: ({ row }) => {
        const status = row.original.deliveryStatus;
        return (
          <>
            {editPermission ? (
              <OrderStatus
                order={row.original}
                deliveryStatus={status}
                disableStatus={[
                  status == "cancelled" ? "" : status,
                  "returned",
                ]}
              />
            ) : (
              <OrderStatus
                order={row.original}
                deliveryStatus={status}
                disableStatus={[status]}
              />
            )}
          </>
        );
      },
    },
    {
      accessorKey: "monitor",
      header: "Monitoring",
      cell: ({ row }) => (
        <MonitoringAndTracking
          order={row.original}
          statusOptions={[
            "not monitoring",
            "monitoring",
            "low warning",
            "high warning",
          ]}
          monitor="monitoring"
        />
      ),
    },
    {
      accessorKey: "tracking",
      header: "Tracking",
      cell: ({ row }) => (
        <MonitoringAndTracking
          order={row.original}
          statusOptions={["not contacted", "contact again", "completed today"]}
          monitor="tracking"
        />
      ),
    },
    ...columns.slice(8),
  ];

  const { isLoading } = useAppSelector(({ pagination }) => pagination);
  const orders = useAppSelector(({ search, monitorDelivery }) => {
    return search.search
      ? search.searchedOrders
      : monitorDelivery.monitorDeliveryOrders;
  });

  const search = useAppSelector(({ search }) => {
    return search.search;
  });

  const table = useReactTable({
    data: orders,
    columns: newColumns,
    // columns: columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedRows = table?.getFilteredSelectedRowModel()?.rows;
  const selectedOrders = formattedOrderData(selectedRows);

  useEffect(() => {
    dispatch(setBulkOrder(selectedOrders));
    dispatch(setEditPermission(editPermission));
  }, [selectedOrders, dispatch, editPermission]);

  return (
    <div className="w-full">
      <div
        className="rounded-md border"
        // className="rounded-md border relative w-full overflow-auto"
        // id="table-container"
        // ref={tableRef} // Attach the ref to the table container
        // onScroll={handleScroll} // Attach the debounced scroll handler
      >
        <Table className="min-w-[1300px]">
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

"use client";
import { PagePagination } from "@/components/pagination/PagePagination";
import OrdersTableSkeleton from "@/components/skeleton/OrdersTableSkeleton";
import OrderStatus from "@/components/OrderStatus";
import { toast } from "@/components/ui/use-toast";
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
import { useSyncCourierStatusMutation } from "@/redux/features/orders/ordersApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TOrders } from "@/types/order.interface";
import backgroundColor from "@/utilities/backgroundColor";
import formattedOrderData from "@/utilities/formattedOrderData";
import { TPermission } from "@/utilities/isPermitted";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import MonitoringAndTracking from "./MonitoringAndTracking";
import { columns } from "./MonitorOrdersColumn";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DeliveryStatusCell = ({ row }: { row: any }) => {
  const orderId = row.original.orderId;
  const status = row.original.deliveryStatus || "";
  const [syncCourierStatus, { isLoading: isSyncing }] =
    useSyncCourierStatusMutation();

  const handleSync = async () => {
    try {
      const res = await syncCourierStatus(orderId).unwrap();
      if (res.success) {
        toast({
          className: "bg-success text-white",
          title: res.message || "Order status synchronized successfully",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.data?.message || "Sync failed",
      });
    }
  };

  return (
    <div
      onClick={handleSync}
      className={`capitalize rounded text-white px-1.5 cursor-pointer flex items-center justify-center gap-1 ${backgroundColor(
        status
      )} ${isSyncing ? "opacity-70 pointer-events-none" : ""}`}
      title="Click to sync status from courier"
    >
      {isSyncing ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
      {status ? status.replaceAll("_", " ") : "Sync"}
    </div>
  );
};

export default function MonitorOrdersTable({
  editPermission,
  permissions,
}: {
  editPermission: boolean;
  permissions: TPermission[];
}) {
  const dispatch = useAppDispatch();

  const newColumns: ColumnDef<TOrders>[] = [
    ...columns.slice(0, 8),
    {
      accessorKey: "deliveryStatus",
      header: "Delivery",
      cell: ({ row }) => <DeliveryStatusCell row={row} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <OrderStatus
            order={row.original}
            permissions={permissions}
            currentRoute="monitor"
          />
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
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRows = table?.getFilteredSelectedRowModel()?.rows;
  const selectedOrders = formattedOrderData(selectedRows);

  useEffect(() => {
    dispatch(setBulkOrder(selectedOrders));
    dispatch(setEditPermission(editPermission));
  }, [selectedOrders, dispatch, editPermission]);

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table className="min-w-[1300px]">
          <TableHeader className="bg-muted">
            {table?.getHeaderGroups()?.map((headerGroup) => (
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
              <OrdersTableSkeleton columns={newColumns.length} />
            ) : table?.getRowModel()?.rows?.length ? (
              table?.getRowModel()?.rows?.map((row) => (
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
      {!search && (
        <div className="flex items-center justify-end py-1">
          <PagePagination />
        </div>
      )}
    </div>
  );
}

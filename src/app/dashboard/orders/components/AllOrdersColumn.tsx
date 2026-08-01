import AddNotes from "@/components/AddNotes";
import CustomerInfo from "@/components/CustomerInfo";
import OrderActionDropDown from "@/components/OrderActionDropDown";
import OrderIdAndDate from "@/components/OrderIdAndDate";
import OrderStatus from "@/components/OrderStatus";
import ProductInfo from "@/components/ProductInfo";
import { Checkbox } from "@/components/ui/checkbox";
import { softBadgeClass } from "@/lib/tableStyles";
import { TOrders } from "@/types/order.interface";
import { TPermission } from "@/utilities/isPermitted";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

const originStyle = (name?: string) => {
  const key = (name || "").toLowerCase();
  if (key.includes("website") || key.includes("web"))
    return "bg-sky-100 text-sky-800";
  if (key.includes("mobile") || key.includes("app"))
    return "bg-primary/10 text-primary";
  if (key.includes("admin")) return "bg-muted text-muted-foreground";
  return "bg-muted text-muted-foreground";
};

const paymentStyle = (name?: string) => {
  const key = (name || "").toLowerCase();
  if (key.includes("cod") || key.includes("cash"))
    return "bg-amber-100 text-amber-800";
  if (
    key.includes("paid") ||
    key.includes("online") ||
    key.includes("bkash") ||
    key.includes("nagad")
  )
    return "bg-emerald-100 text-emerald-800";
  return "bg-muted text-muted-foreground";
};

export const getColumns = (
  permissions: TPermission[]
): ColumnDef<TOrders>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "",
    header: "SL",
    cell: ({ table, row }) => (
      <span className="text-xs text-muted-foreground tabular-nums">
        {table.getFilteredRowModel().rows?.length - row.index}
      </span>
    ),
  },
  {
    accessorKey: "orderId",
    header: "Order",
    cell: ({ row }) => (
      <OrderIdAndDate
        orderId={row.original.orderId}
        _id={row.original._id}
        timestamp={row.original.createdAt}
      />
    ),
  },
  {
    accessorKey: "shipping",
    header: "Customer",
    cell: ({ row }) => <CustomerInfo order={row.original} />,
  },
  {
    accessorKey: "product",
    header: "Items",
    cell: ({ row }) => <ProductInfo products={row.original.products} />,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const total = row.getValue("total") as number;
      const advance = row.original.advance || 0;
      const due = Math.max(0, Number(total || 0) - Number(advance || 0));
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground tabular-nums whitespace-nowrap">
            &#2547;{total}
          </span>
          {advance > 0 && due > 0 && (
            <span className="text-[11px] text-rose-600 tabular-nums whitespace-nowrap">
              Due &#2547;{due}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "payment",
    header: "Payment",
    cell: ({ row }) => {
      const name = row.original.payment?.paymentMethod?.name;
      return (
        <span
          className={cn(softBadgeClass(), paymentStyle(name), "capitalize")}
        >
          {name || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <OrderStatus
        order={row.original}
        disableStatus={["processing", "deleted"]}
        permissions={permissions}
        currentRoute="orders"
      />
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => <AddNotes order={row.original} />,
  },
  {
    accessorKey: "orderSource",
    header: "Origin",
    cell: ({ row }) => {
      const name = row.original.orderSource?.name;
      return (
        <span className={cn(softBadgeClass(), originStyle(name), "capitalize")}>
          {name || "—"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    enableHiding: false,
    cell: ({ row }) => <OrderActionDropDown order={row.original} />,
  },
];

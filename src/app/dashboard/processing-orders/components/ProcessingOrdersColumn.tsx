import AddNotes from "@/components/AddNotes";
import CustomerInfo from "@/components/CustomerInfo";
import OrderActionDropDown from "@/components/OrderActionDropDown";
import OrderIdAndDate from "@/components/OrderIdAndDate";
import OrderStatus from "@/components/OrderStatus";
import ProductInfo from "@/components/ProductInfo";
import { Checkbox } from "@/components/ui/checkbox";
import { TOrders } from "@/types/order.interface";
import { ColumnDef } from "@tanstack/react-table";
// import ProductCode from "./ProductCode";

import { TPermission } from "@/utilities/isPermitted";

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
      />
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "",
    header: "SL",
    cell: ({ table, row }) => (
      <div className="capitalize flex flex-col justify-center items-center">
        <span className="">
          {table.getFilteredRowModel().rows?.length - row.index}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "orderId",
    header: "Order Id & Date",
    cell: ({ row }) => (
      <OrderIdAndDate
        orderId={row.original.orderId}
        _id={row.original._id}
        timestamp={row.original.createdAt}
        className="flex flex-col"
      />
    ),
  },
  {
    accessorKey: "shipping",
    header: "Customer Info",
    cell: ({ row }) => {
      return <CustomerInfo order={row.original} />;
    },
  },
  {
    accessorKey: "product",
    header: "Product Info",
    cell: ({ row }) => {
      return <ProductInfo products={row.original.products} />;
    },
  },
  // {
  //   accessorKey: "productCode",
  //   header: "Product Code",
  //   cell: ({ row }) => {
  //     const status = row.original.status;
  //     const isDisable =
  //       status === "partial completed" || status === "returned" ? true : false;
  //     return <ProductCode order={row.original} disable={isDisable} />;
  //   },
  // },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => <span>&#2547; {row.getValue("total")}</span>,
  },
  {
    accessorKey: "payment",
    header: "Payment",
    cell: ({ row }) => <p>{row.original.payment?.paymentMethod?.name}</p>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <OrderStatus
        order={row.original}
        disableStatus={["processing done", "partial completed", "returned"]}
        permissions={permissions}
        currentRoute="processing"
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
    cell: ({ row }) => (
      <div className="capitalized ">{row.original.orderSource?.name}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => <OrderActionDropDown order={row.original} />,
  },
];

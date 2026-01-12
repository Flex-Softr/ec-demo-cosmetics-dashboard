import AddNotes from "@/components/AddNotes";
import CustomerInfo from "@/components/CustomerInfo";
import OrderActionDropDown from "@/components/OrderActionDropDown";
import OrderIdAndDate from "@/components/OrderIdAndDate";
import { Checkbox } from "@/components/ui/checkbox";
import { TOrders } from "@/types/order.interface";
import { ColumnDef } from "@tanstack/react-table";
// import ReasonNotes from "./ReasonNotes";
import ProductInfo from "@/components/ProductInfo";
import ProductCode from "../../processing-orders/components/ProductCode";

export const columns: ColumnDef<TOrders>[] = [
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
  {
    accessorKey: "productCode",
    header: "Product Code",
    cell: ({ row }) => <ProductCode order={row.original} disable={true} />,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => <span>&#2547; {row.getValue("total")}</span>,
  },
  {
    accessorKey: "payment",
    header: "Payment",
    cell: () => <p>Case on delivery</p>,
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => <AddNotes order={row.original} />,
  },
  // {
  //   accessorKey: "notes",
  //   header: "Delivery Notes",
  //   cell: ({ row }) => <ReasonNotes order={row.original} />,
  // },
  {
    accessorKey: "orderSource",
    header: "Origin",
    cell: ({ row }) => (
      <div className="capitalized">{row.original.orderSource?.name}</div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => <OrderActionDropDown order={row.original} />,
  },
];

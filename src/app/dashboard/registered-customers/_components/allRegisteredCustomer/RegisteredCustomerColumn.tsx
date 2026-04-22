import CustomerInfo from "@/components/CustomerInfo";
import { TRegisteredCustomer } from "@/types/registeredUser";
import { ColumnDef } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import RegisteredCustomerDetails from "./RegisteredCustomerDetails";
import UpdateUserStatus from "./UpdateUserStatus";

const columns: ColumnDef<TRegisteredCustomer>[] = [
  {
    accessorKey: "",
    header: "SL",
    cell: ({ row }) => (
      <div className="capitalize flex flex-col justify-center items-center">
        <span className="">{row?.index + 1}</span>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <h2 className="text-start">ID</h2>,
    cell: ({ row }) => (
      <Link
        href={`/dashboard/registered-customers/${row.original?._id}`}
        className="text-start font-semibold text-primary hover:underline"
      >
        {row.original?.uid}
      </Link>
    ),
  },
  {
    accessorKey: "shipping",
    header: "Customer Info",
    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <CustomerInfo order={row.original as any} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Registered At",
    cell: ({ row }) => (
      <div className="flex flex-col min-w-28">
        <span className="font-medium">
          {row.original.createdAt
            ? format(new Date(row.original.createdAt), "dd MMM yyyy")
            : "N/A"}
        </span>
        <span className="text-xs text-muted-foreground">
          {row.original.createdAt ? (
            <>
              {format(new Date(row.original.createdAt), "hh:mm a")} (
              {formatDistanceToNow(new Date(row.original.createdAt), {
                addSuffix: true,
              })}
              )
            </>
          ) : (
            ""
          )}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "totalOrders",
    header: "Total Orders",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
            <ShoppingBag size={14} />
          </div>
          <span className="font-semibold">{row?.original?.totalOrders}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <UpdateUserStatus
          status={row.original?.status}
          id={row.original?._id}
        />
      );
    },
  },
  {
    accessorKey: "orders",
    header: "Orders",
    cell: ({ row }) => {
      return <RegisteredCustomerDetails customer={row.original} />;
    },
  },
];
export default columns;

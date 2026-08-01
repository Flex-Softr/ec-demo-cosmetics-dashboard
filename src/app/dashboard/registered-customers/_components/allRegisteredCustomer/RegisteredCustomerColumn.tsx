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
    id: "sl",
    header: "SL",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.index + 1}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "ID",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/registered-customers/${row.original?._id}`}
        className="font-semibold text-foreground hover:text-primary hover:underline"
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
      <div className="flex min-w-28 flex-col text-left">
        <span className="font-medium text-foreground">
          {row.original.createdAt
            ? format(new Date(row.original.createdAt), "dd MMM yyyy")
            : "—"}
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
        <div className="flex items-center justify-center gap-2">
          <div className="rounded-md bg-primary/10 p-1.5 text-primary">
            <ShoppingBag size={14} />
          </div>
          <span className="font-semibold text-foreground">
            {row?.original?.totalOrders}
          </span>
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
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      return <RegisteredCustomerDetails customer={row.original} />;
    },
  },
];
export default columns;

import CustomerInfo from "@/components/CustomerInfo";
import { TRegisteredCustomer } from "@/types/registeredUser/registeredUser";
import { ColumnDef } from "@tanstack/react-table";
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
    cell: ({ row }) => <h2 className="text-start">{row.original?.uid}</h2>,
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
    accessorKey: "totalOrders",
    header: "Total orders",
    cell: ({ row }) => {
      return <h4>{row?.original?.totalOrders}</h4>;
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

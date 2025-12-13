import { TShippingCharge } from "@/redux/features/shippingCharge/shippingChargeInterface";
import { ColumnDef } from "@tanstack/react-table";
import Action from "./Action";
import UpdateActiveStatus from "./UpdateActiveStatus";

const columns: ColumnDef<TShippingCharge>[] = [
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
    header: () => <h2 className="text-start">Name</h2>,
    cell: ({ row }) => <h2 className="text-start">{row.original?.name}</h2>,
  },
  {
    accessorKey: "amount",
    header: () => <h2 className="text-start">Amount</h2>,
    cell: ({ row }) => <h2 className="text-start">{row.original?.amount}</h2>,
  },
  {
    accessorKey: "isActive",
    header: () => <h2 className="text-start">Active status</h2>,
    cell: ({ row }) => <UpdateActiveStatus shippingCharge={row.original} />,
  },
  {
    accessorKey: "action",
    header: () => <h2 className="text-center">Action</h2>,
    cell: ({ row }) => <Action shippingCharge={row.original} />,
  },
];
export default columns;

import CustomerInfo from "@/components/CustomerInfo";
import { Button } from "@/components/ui/button";
import { TImageToOrderReq } from "@/redux/features/imageToOrder/imageToOrderInterface";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import ContactStatus from "./ContactStatus/ContactStatus";
import CreateOrder from "./CreateOrder/CreateNewOrder";
import CustomerNotes from "./CustomerNotes/CustomerNotes";
import Images from "./Images/Images";
import ITOStatus from "./Status/ITOStatus";

const columns: ColumnDef<TImageToOrderReq>[] = [
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
    accessorKey: "reqId",
    header: () => <h2 className="text-center">Request Id</h2>,
    cell: ({ row }) => <p>{row.original?.reqId}</p>,
  },
  {
    accessorKey: "shipping",
    header: () => <h2 className="text-center">Address</h2>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cell: ({ row }) => <CustomerInfo order={row?.original as any} />,
  },
  {
    accessorKey: "images",
    header: () => <h2 className="text-center">Images</h2>,
    cell: ({ row }) => <Images images={row.original?.images} />,
  },
  {
    accessorKey: "contactStatus",
    header: () => <h2 className="text-center">Contact status</h2>,
    cell: ({ row }) => (
      <ContactStatus
        contactStatus={row.original.contactStatus}
        _id={row.original._id}
      />
    ),
  },
  {
    accessorKey: "status",
    header: () => <h2 className="text-center">Status</h2>,
    cell: ({ row }) => (
      <ITOStatus currentStatus={row.original.status} _id={row.original._id} />
    ),
  },
  {
    accessorKey: "customerNotes",
    header: () => <h2 className="text-center">Customer notes</h2>,
    cell: ({ row }) => <CustomerNotes reqData={row.original} />,
  },
  {
    accessorKey: "largeImages",
    header: () => <h2 className="text-center">View large images</h2>,
    cell: ({ row }) => (
      <>
        <Link
          target="_blank"
          href={`/dashboard/image-to-order/images/${row.original._id}`}
        >
          <Button className="bg-inherit text-inherit hover:bg-inherit">
            View images
          </Button>
        </Link>
      </>
    ),
  },
  {
    accessorKey: "createOrder",
    header: () => <h2 className="text-center">View large images</h2>,
    cell: ({ row }) => (
      <>
        <CreateOrder reqData={row.original} />
      </>
    ),
  },
];
export default columns;

import { ColumnDef } from "@tanstack/react-table";

import config from "@/config/config";
import Image from "next/image";
import DeleteSlider from "./DeleteSlider";
import { TSlider } from "./SliderMediaTable";
import UpdateSliderActiveStatus from "./UpdateSliderActiveStatus";

const columns: ColumnDef<TSlider>[] = [
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
    cell: ({ row }) => (
      <h2 className="text-start w-24">{row.original?.name}</h2>
    ),
  },
  {
    accessorKey: "Image",
    header: () => <h2 className="text-start">Image</h2>,
    cell: ({ row }) => (
      <Image
        src={`${config.base_url}/${row.original.image?.src}`}
        className="w-44 "
        alt={""}
        width={300}
        height={300}
      />
    ),
  },

  {
    accessorKey: "action",
    header: () => <h2 className="text-end"> Action</h2>,
    cell: ({ row }) => (
      <div className="flex justify-between items-center">
        <UpdateSliderActiveStatus slider={row.original} />
        <DeleteSlider slider={row.original} />
      </div>
    ),
  },
];
export default columns;

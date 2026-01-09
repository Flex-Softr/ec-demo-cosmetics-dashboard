import { ColumnDef } from "@tanstack/react-table";

import Image from "next/image";
import DeleteSlider from "./DeleteSlider";
import { TSlider } from "./SliderMediaTable";
import UpdateSlider from "./UpdateSlider";
import UpdateSliderActiveStatus from "./UpdateSliderActiveStatus";
import { formatImageSrc } from "@/lib/utils";

const columns: ColumnDef<TSlider>[] = [
  {
    accessorKey: "",
    header: "SL",
    cell: ({ row }) => (
      <div className="capitalize flex flex-col justify-center items-center">
        <span className="">{row.original?.sortOrder}</span>
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
        src={formatImageSrc(row.original.image?.src)}
        className="w-44 "
        alt={""}
        width={300}
        height={300}
      />
    ),
  },
  {
    accessorKey: "bannerLink",
    header: "Banner Link",
    cell: ({ row }) => <p className="text-center">{row.original.bannerLink}</p>,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <UpdateSliderActiveStatus slider={row.original} />
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: () => <h2 className="text-end"> Action</h2>,
    cell: ({ row }) => (
      <div className="flex justify-between items-center">
        <UpdateSlider slider={row.original} />
        <DeleteSlider slider={row.original} />
      </div>
    ),
  },
];
export default columns;

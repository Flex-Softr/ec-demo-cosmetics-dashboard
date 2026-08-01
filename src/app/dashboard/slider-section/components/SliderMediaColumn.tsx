import { ColumnDef } from "@tanstack/react-table";

import { formatImageSrc } from "@/lib/utils";
import Image from "next/image";
import { TSlider } from "../lib/slider.interface";
import SliderAction from "./SliderAction";
import UpdateSliderActiveStatus from "./UpdateSliderActiveStatus";

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
    header: () => (
      <span className="text-white whitespace-nowrap">Banner Link</span>
    ),
    cell: ({ row }) => (
      <p className="w-24 sm:w-auto sm:max-w-96 break-all text-center">
        {row.original.bannerLink}
      </p>
    ),
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
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => <SliderAction slider={row.original} />,
  },
];
export default columns;

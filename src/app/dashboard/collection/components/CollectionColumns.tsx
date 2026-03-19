"use client";

import { formatImageSrc } from "@/lib/utils";
import { ICollection } from "@/types/collection";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import CollectionAction from "./CollectionAction";

export const columns: ColumnDef<ICollection>[] = [
  {
    id: "sl",
    header: "SL",
    cell: ({ row }) => row.original.sortOrder,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const img = row.original.image as any;
      const src = formatImageSrc(img?.src);
      return (
        <div className="relative h-10 w-10 overflow-hidden rounded">
          <Image
            src={src}
            alt={row.original.name}
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          row.original.isActive
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <CollectionAction collection={row.original} />
      </div>
    ),
  },
];

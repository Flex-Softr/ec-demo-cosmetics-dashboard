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
        <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border bg-muted">
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
      <span className="whitespace-nowrap font-semibold text-foreground">
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          row.original.isActive
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-700"
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

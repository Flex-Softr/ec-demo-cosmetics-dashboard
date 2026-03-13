"use client";

import { formatImageSrc } from "@/lib/utils";
import { TBrand } from "../lib/brand.interface";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import BrandAction from "./BrandAction";

export const columns: ColumnDef<TBrand>[] = [
  {
    id: "sl",
    header: "SL",
    cell: ({ row }) => row.original.sortOrder,
  },
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      const src = formatImageSrc(row.original.logo?.src);
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
      <span className="capitalize font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <div
          className="max-w-[500px] truncate"
          title={row.original.description}
        >
          {description || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
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
        <BrandAction brand={row.original} />
      </div>
    ),
  },
];

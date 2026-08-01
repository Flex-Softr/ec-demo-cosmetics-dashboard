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
      <span className="whitespace-nowrap font-semibold capitalize text-foreground">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <div
          className="max-w-[500px] truncate text-sm text-muted-foreground"
          title={row.original.description}
        >
          {description || "—"}
        </div>
      );
    },
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
        <BrandAction brand={row.original} />
      </div>
    ),
  },
];

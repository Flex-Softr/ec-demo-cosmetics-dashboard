"use client";

import { ICollection } from "@/types/collection";
import { THomePageSection } from "@/types/homepageSection";
import { ColumnDef } from "@tanstack/react-table";
import HomepageSectionAction from "./HomepageSectionAction";
import UpdateHomepageSectionActiveStatus from "./UpdateHomepageSectionActiveStatus";

export const columns: ColumnDef<THomePageSection>[] = [
  {
    accessorKey: "sortOrder",
    header: "SL",
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => row.original.title || "N/A",
  },
  {
    accessorKey: "subtitle",
    header: "Subtitle",
  },
  {
    accessorKey: "collectionId",
    header: "Collection",
    cell: ({ row }) => {
      const collection = row.original.collectionId as ICollection;
      return collection?.name || "N/A";
    },
  },
  {
    accessorKey: "limit",
    header: "Product Qty",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <UpdateHomepageSectionActiveStatus homepageSection={row.original} />
    ),
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <HomepageSectionAction homepageSection={row.original} />
      </div>
    ),
  },
];

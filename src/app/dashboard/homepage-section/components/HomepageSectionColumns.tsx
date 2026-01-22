"use client";

import { ICollection } from "@/types/collection";
import { THomePageSection } from "@/types/homepageSection";
import { ColumnDef } from "@tanstack/react-table";
import HomepageSectionAction from "./HomepageSectionAction";

export const columns: ColumnDef<THomePageSection>[] = [
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
      return collection?.title || "N/A";
    },
  },
  {
    accessorKey: "sortOrder",
    header: "Sort Order",
  },
  {
    accessorKey: "limit",
    header: "Limit",
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

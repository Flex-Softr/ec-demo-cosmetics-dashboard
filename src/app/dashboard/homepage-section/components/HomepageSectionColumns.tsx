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
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "subtitle",
    header: "Subtitle",
    cell: ({ row }) => (
      <span className="block w-20 sm:w-auto truncate sm:whitespace-normal">
        {row.original.subtitle}
      </span>
    ),
  },
  {
    accessorKey: "collectionId",
    header: "Collection",
    cell: ({ row }) => {
      const collection = row.original.collectionId as ICollection;
      return <span className="whitespace-nowrap">{collection?.name}</span>;
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

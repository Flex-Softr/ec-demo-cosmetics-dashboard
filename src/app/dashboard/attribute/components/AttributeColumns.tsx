"use client";

import { TAttribute } from "../lib/attribute.interface";
import { ColumnDef } from "@tanstack/react-table";
import AttributeAction from "./AttributeAction";
import UpdateAttributeActiveStatus from "./UpdateAttributeActiveStatus";

export const columns: ColumnDef<TAttribute>[] = [
  {
    accessorKey: "name",
    header: "Attribute Name",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-base font-semibold text-foreground">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "values",
    header: "Values",
    cell: ({ row }) => {
      const values = row.original.values;
      return (
        <div className="min-w-80">
          <div className="flex flex-wrap gap-1.5">
            {values && values.length > 0 ? (
              values.map((item) => (
                <span
                  key={item?._id}
                  className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                >
                  {item?.name}
                </span>
              ))
            ) : (
              <span className="text-sm italic text-muted-foreground">
                No values
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <UpdateAttributeActiveStatus attribute={row.original} />
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <AttributeAction attribute={row.original} />
      </div>
    ),
  },
];

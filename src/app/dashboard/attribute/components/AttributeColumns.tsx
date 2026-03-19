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
      <span className="font-medium text-base whitespace-nowrap">
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
          <div className="flex flex-wrap gap-2">
            {values && values.length > 0 ? (
              values.map((item) => (
                <span
                  key={item?._id}
                  className="px-2.5 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border"
                >
                  {item?.name}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground text-sm italic">
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

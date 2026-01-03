"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TOrderedProducts } from "@/types/order.interface";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export const columns: ColumnDef<TOrderedProducts>[] = [
  {
    accessorKey: "",
    header: "SL",
    cell: ({ row }) => (
      <div className="capitalize flex flex-col justify-start">
        <span>{row.index + 1}</span>
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Product Description",
    cell: ({ row }) => {
      const { title, attributes = {} } = row.original;
      const variationProps = Object.keys(attributes)
        .map((key) => attributes[key])
        .join(" ");
      return (
        <p>
          <span className="font-semibold">{title}</span>
          {variationProps && (
            <span
              style={{ fontStyle: "italic", color: "#555", fontWeight: 600 }}
            >
              {""} ({variationProps})
            </span>
          )}
        </p>
      );
    },
  },
  {
    accessorKey: "unitPrice",
    header: "Price",
    cell: ({ row }) => (
      <span className="lowercase text-center">{row.original.unitPrice}</span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <div className="lowercase">{row.original.quantity}</div>,
  },
  {
    accessorKey: "total",
    header: "Amount",
    cell: ({ row }) => <div className="lowercase">{row.original.total}</div>,
  },
];

export function InvoiceItemsTable({
  products,
}: {
  products: TOrderedProducts[];
}) {
  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-primary">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="hover:bg-primary/90 border-none"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="font-bold text-white h-9 text-xs uppercase px-2 first:pl-4 last:pr-4"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-gray-100"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3 px-4 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

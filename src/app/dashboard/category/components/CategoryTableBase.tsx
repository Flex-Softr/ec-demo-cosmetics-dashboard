"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatImageSrc } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import Image from "next/image";
import * as React from "react";
import CategoryActionBase from "./CategoryActionBase";
import NavigateSubCategory from "./NavigateSubCategory";
import CategoryStatusAction from "./CategoryStatusAction";
import { TCategories } from "../lib/category.interface";
import { Button } from "@/components/ui/button";

type CategoryTableBaseProps = {
  data: TCategories[];
  isSubCategory?: boolean;
  globalFilter?: string;
  setGlobalFilter?: (value: string) => void;
  isLoading?: boolean;
};

export const CategoryTableBase = ({
  data,
  isSubCategory = false,
  globalFilter,
  setGlobalFilter,
  isLoading,
}: CategoryTableBaseProps) => {
  const columns = React.useMemo<ColumnDef<TCategories>[]>(() => {
    const baseColumns: ColumnDef<TCategories>[] = [
      {
        id: "sl",
        header: "SL",
        cell: ({ row }) => row.original.sortOrder,
      },
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => (
          <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border bg-muted">
            <Image
              width={40}
              height={40}
              src={formatImageSrc(row.original.image?.src)}
              alt={row?.original?.name}
              className="h-full w-full object-cover"
            />
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="whitespace-nowrap font-semibold capitalize text-foreground">
            {row.getValue("name")}
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="max-w-[300px] truncate text-muted-foreground whitespace-pre-wrap">
            {row.getValue("description")}
          </div>
        ),
      },
    ];

    if (!isSubCategory) {
      baseColumns.push({
        accessorKey: "items",
        header: "Sub Categories",
        cell: ({ row }) => <NavigateSubCategory category={row.original} />,
      });
    }

    baseColumns.push(
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => <CategoryStatusAction category={row.original} />,
      },
      {
        id: "_id",
        accessorKey: "_id",
        header: () => <div className="text-center">Action</div>,
        enableHiding: true,
        cell: ({ row }) => (
          <CategoryActionBase
            category={row.original}
            isSubCategory={isSubCategory}
          />
        ),
      }
    );

    return baseColumns;
  }, [isSubCategory]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row._id,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
  });

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground">
        Loading categories…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border hover:bg-muted"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {isSubCategory ? "No results." : "No categories found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isSubCategory && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

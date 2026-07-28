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
          <Image
            width={50}
            height={50}
            src={formatImageSrc(row.original.image?.src)}
            alt={row?.original?.name}
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="capitalize font-medium whitespace-nowrap">
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
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-y-auto">
        <Table>
          <TableHeader
            className={
              !isSubCategory
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : ""
            }
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={!isSubCategory ? "hover:bg-primary/90" : ""}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
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
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center"
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

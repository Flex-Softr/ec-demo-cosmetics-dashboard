"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import config from "@/config/config";
import { useDeleteBrandMutation } from "@/redux/features/brand/brandApi";
import { refetchData } from "@/utilities/fetchData";
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import * as React from "react";
import BrandActions from "./BrandActions";

export type TBrands = {
  _id: string;
  name: string;
  slug: string;
  logo: {
    src: string;
    alt: string;
  };
  description: string;
};

export const columns: ColumnDef<TBrands>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => (
      <Image
        width={50}
        height={50}
        src={`${config.base_url}/${row.original.logo?.src}`}
        alt={row?.original?.name}
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <span title={row.original.description}>
          {description ? description.slice(0, 20) + "..." : null}
        </span>
      );
    },
  },
  {
    id: "_id",
    accessorKey: "_id",
    header: () => <div className="text-center">Action</div>,
    enableHiding: true,
    cell: ({ row }) => <BrandActions brand={row.original} />,
  },
];

export const BrandTable = ({ brands }: { brands: TBrands[] }) => {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteBrand] = useDeleteBrandMutation();

  const table = useReactTable({
    data: brands,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRows = table?.getFilteredSelectedRowModel()?.rows;
  const brandIds = selectedRows.map(({ original }) => original._id);

  const handleDelete = async () => {
    if (brandIds.length) {
      const res = await deleteBrand(brandIds).unwrap();
      if (res?.success) {
        await refetchData("brands");
        toast({
          className: "bg-success text-white ",
          title: "Brand deleted successfully!",
        });
      } else {
        toast({
          className: "bg-danger text-whit",
          title: "Something Went Wrong",
        });
      }
    } else {
      alert("Please select brands!");
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-4">
        <div className="flex justify-start  gap-2">
          <Select>
            <SelectTrigger className="w-[180px] border-primary focus:ring-primary focus:ring-1">
              <SelectValue placeholder="Bulk Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Bulk Action</SelectLabel>
                <SelectItem value="delete">Delete</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleDelete}>Apply</Button>
        </div>
        <Input
          placeholder="Filter Name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                >
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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
      </div>
    </div>
  );
};

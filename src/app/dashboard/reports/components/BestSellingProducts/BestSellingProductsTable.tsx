"use client";
import { TBestSellingProduct } from "@/types/reports/period";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<TBestSellingProduct>[] = [
  {
    accessorKey: "",
    header: () => <h4 className="text-center">SL. No.</h4>,
    id: "sl",
    cell: ({ row }) => (
      <div className="capitalize flex flex-col justify-center items-center">
        <span>{row.index + 1}</span>
      </div>
    ),
  },
  {
    accessorKey: "productImage",
    header: "Name",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original.productImage} />
        <AvatarFallback>{row.original.productName}</AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.productName}</div>
    ),
  },
  {
    accessorKey: "stockAvailable",
    header: "Stock",
    cell: ({ row }) => (
      <div className="lowercase">{row.original.stockAvailable}</div>
    ),
  },
  {
    accessorKey: "totalWarrantyClaims",
    header: () => <h2 className="text-right">Total warranty</h2>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.totalWarrantyClaims}</div>
    ),
  },
  {
    accessorKey: "totalSales",
    header: () => <h2 className="text-right">Total sales</h2>,
    cell: ({ row }) => (
      <div className="font-medium text-right">{row.original.totalSales}</div>
    ),
  },
];
const BestSellingProductsTable = ({
  bestSellingProductData,
  isLoading,
}: {
  bestSellingProductData: TBestSellingProduct[];
  isLoading: boolean;
}) => {
  const table = useReactTable({
    data: bestSellingProductData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-md border overflow-hidden">
        <Table className="min-w-[500px]">
          <TableHeader className="bg-primary text-white rounded-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-muted/0">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-start">
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
          <TableBody className="max-h-[521.5px] overflow-x-scroll">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-start">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <TableSkeleton />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BestSellingProductsTable;

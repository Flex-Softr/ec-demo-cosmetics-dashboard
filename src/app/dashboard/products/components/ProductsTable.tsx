"use client";
import { PagePagination } from "@/components/pagination/PagePagination";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { setBulkProduct } from "@/redux/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IAdminProduct } from "@/types/products";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect } from "react";
import { ProductColumns } from "./ProductColumn";

export default function ProductsTable() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(({ pagination }) => pagination);
  const products = useAppSelector(({ products }) => {
    return products.search
      ? (products.searchedProducts as unknown as IAdminProduct[])
      : (products.products as unknown as IAdminProduct[]);
  });
  const search = useAppSelector(({ products }) => products.search);
  const table = useReactTable<IAdminProduct>({
    data: products,
    columns: ProductColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRows = table?.getFilteredSelectedRowModel()?.rows;
  // const selectedProducts = formattedOrderData(selectedRows);
  const productsIds = selectedRows.map(({ original }) => original._id);

  useEffect(() => {
    dispatch(setBulkProduct({ productsIds }));
  }, [productsIds, dispatch]);

  return (
    <div className="w-full">
      <div className="rounded-lg overflow-hidden border">
        <Table className="min-w-[1100px]">
          <TableHeader className="bg-primary text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-muted/0">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-left px-4">
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
                  className="border-b"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-left p-0">
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
                  colSpan={ProductColumns.length}
                  className="h-24 text-center"
                >
                  <TableSkeleton />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={ProductColumns.length}
                  className="h-24 text-center"
                >
                  No products
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!search && (
        <div className="flex items-center justify-end space-x-2 py-2">
          <PagePagination />
        </div>
      )}
    </div>
  );
}

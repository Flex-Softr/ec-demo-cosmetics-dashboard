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
import { setBulkProduct } from "@/redux/features/allProducts/allProductsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect } from "react";
import { columns } from "./Column";

export default function ProductsTable() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(({ pagination }) => pagination);
  const products = useAppSelector(({ allProducts }) =>
    allProducts.search ? allProducts.searchedProducts : allProducts.products
  );
  const search = useAppSelector(({ allProducts }) => allProducts.search);
  const table = useReactTable({
    data: products,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
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
                    <TableHead key={header.id} className="text-center">
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
                    <TableCell key={cell.id} className="text-center">
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

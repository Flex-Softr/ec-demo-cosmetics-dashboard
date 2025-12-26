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
import { IAdminProduct } from "@/types/products";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect } from "react";
import { ProductColumns } from "./ProductColumn";

export default function ProductsTable() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(({ pagination }) => pagination);
  const products = useAppSelector(({ allProducts }) =>
    allProducts.search
      ? (allProducts.searchedProducts as unknown as IAdminProduct[])
      : (allProducts.products as unknown as IAdminProduct[])
  );
  const search = useAppSelector(({ allProducts }) => allProducts.search);
  const table = useReactTable({
    data: products,
    columns: ProductColumns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: (row) =>
      row.original.type === "variable" &&
      (row.original.variations?.length ?? 0) > 0,
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
                <>
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
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell
                        colSpan={ProductColumns.length}
                        className="p-4 bg-muted/50"
                      >
                        {row.original.type === "variable" &&
                        row.original.variations?.length ? (
                          <div className="rounded-md border bg-white">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Attributes</TableHead>
                                  <TableHead>Price</TableHead>
                                  <TableHead>Stock</TableHead>
                                  <TableHead>SKU</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {row.original.variations.map(
                                  (variation, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        {Object.entries(
                                          variation.attributes
                                        ).map(([name, value]) => (
                                          <span
                                            key={name}
                                            className="mr-2 px-2 py-1 bg-gray-100 rounded text-xs"
                                          >
                                            {name}: {value}
                                          </span>
                                        ))}
                                      </TableCell>
                                      <TableCell>
                                        ৳{" "}
                                        {variation.price?.salePrice ||
                                          variation.price?.regularPrice}
                                      </TableCell>
                                      <TableCell>
                                        <span
                                          className={
                                            variation.inventory?.stockStatus ===
                                            "In stock"
                                              ? "text-green-600"
                                              : "text-red-600"
                                          }
                                        >
                                          {variation.inventory?.stockStatus} (
                                          {variation.inventory?.stockQuantity})
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        {variation.inventory?.sku}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="p-4 text-center text-muted-foreground">
                            No variations data available.
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </>
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

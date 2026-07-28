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
import {
  setBulkProduct,
  setBulkProductSlugs,
} from "@/redux/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IAdminProduct } from "@/types/products";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment, useEffect, useState } from "react";
import { ProductColumns } from "./ProductColumn";
import {
  VariationActiveStatus,
  VariationAttributes,
  VariationPrice,
  VariationQty,
  VariationSKU,
  VariationStock,
} from "./ProductVariations";

export default function ProductsTable() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(({ pagination }) => pagination);
  const products = useAppSelector(({ products }) => {
    return products.search
      ? (products.searchedProducts as unknown as IAdminProduct[])
      : (products.products as unknown as IAdminProduct[]);
  });
  const search = useAppSelector(({ products }) => products.search);
  const [expanded, setExpanded] = useState({});

  const table = useReactTable<IAdminProduct>({
    data: products,
    columns: ProductColumns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const selectedRows = table?.getFilteredSelectedRowModel()?.rows;
  const productsIds = selectedRows.map(({ original }) => original._id);
  const productsSlugs = selectedRows.map(({ original }) => original.slug);

  useEffect(() => {
    dispatch(setBulkProduct(productsIds));
    dispatch(setBulkProductSlugs(productsSlugs));
  }, [productsIds, productsSlugs, dispatch]);

  return (
    <div className="w-full">
      <div className="rounded-lg overflow-hidden border">
        <Table className="min-w-[1100px]">
          <TableHeader className="bg-primary text-primary-foreground">
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
                <Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className={row.getIsExpanded() ? "border-none" : "border-b"}
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
                  {row.getIsExpanded() &&
                    row.original.variations?.map((variation, vIndex) => (
                      <TableRow
                        key={`${row.id}-v-${vIndex}`}
                        className={`${
                          vIndex === row.original.variations!.length - 1
                            ? "border-b"
                            : "border-b border-border/20"
                        } hover:bg-slate-200 hover:border-b hover:border-border/20 transition-colors`}
                      >
                        {table.getVisibleFlatColumns().map((column) => (
                          <TableCell key={column.id} className="px-4 py-2">
                            {column.id === "title" && (
                              <VariationAttributes
                                attributes={variation.attributes}
                              />
                            )}
                            {column.id === "sku" && (
                              <div className="text-center">
                                <VariationSKU sku={variation.inventory.sku!} />
                              </div>
                            )}
                            {column.id === "price" && (
                              <VariationPrice price={variation.price} />
                            )}
                            {column.id === "stock" && (
                              <div className="text-center">
                                <VariationStock
                                  status={variation.inventory.stockStatus}
                                />
                              </div>
                            )}
                            {column.id === "stockAvailable" && (
                              <div className="text-center">
                                <VariationQty
                                  manageStock={variation.inventory.manageStock}
                                  stockAvailable={
                                    variation.inventory.stockAvailable
                                  }
                                />
                              </div>
                            )}
                            {column.id === "publishedStatus" && (
                              <VariationActiveStatus
                                isActive={variation.isActive}
                              />
                            )}
                            {![
                              "title",
                              "sku",
                              "price",
                              "stock",
                              "stockAvailable",
                              "publishedStatus",
                            ].includes(column.id) && (
                              <div className="flex justify-center" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </Fragment>
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

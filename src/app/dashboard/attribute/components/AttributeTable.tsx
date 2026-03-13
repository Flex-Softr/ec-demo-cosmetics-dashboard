"use client";

import { PagePagination } from "@/components/pagination/PagePagination";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetAttributesQuery } from "@/redux/features/attributes/attributesApi";
import {
  setIsLoading,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { columns } from "./AttributeColumns";

const AttributeTable = () => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector(({ pagination }) => pagination);

  const [globalFilter, setGlobalFilter] = React.useState("");
  const debouncedSearch = useDebounce(globalFilter, 500);

  // Note: if query API supports search, pass it here natively.
  const queryParams = debouncedSearch
    ? { search: debouncedSearch }
    : { page, limit };

  const { data: response, isLoading } = useGetAttributesQuery(queryParams);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const attributesData: any = response;
  const attributes = attributesData?.data?.data || attributesData?.data || [];
  const meta = attributesData?.data?.meta || attributesData?.meta;

  if (!attributes.length && page > 1) {
    dispatch(setPage(1));
  }

  React.useEffect(() => {
    if (meta) {
      dispatch(setTotalPage({ total: meta.total, totalPage: meta.totalPage }));
    }
  }, [meta, dispatch]);

  React.useEffect(() => {
    dispatch(setIsLoading(isLoading));
  }, [isLoading, dispatch]);

  const table = useReactTable({
    data: attributes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row._id,
  });

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center h-40">
        <p className="text-xl font-semibold text-gray-900">
          Loading attributes...
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Input
          placeholder="Search attributes..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-primary hover:bg-primary/95 transition-colors">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white">
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
                    <TableCell key={cell.id} className="align-top py-4">
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
                  No attributes found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!globalFilter && meta && (
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 py-2">
          <div className="text-sm text-muted-foreground">
            Showing Page {page} of {meta.totalPage || 1}
          </div>
          <PagePagination />
        </div>
      )}
    </div>
  );
};

export default AttributeTable;

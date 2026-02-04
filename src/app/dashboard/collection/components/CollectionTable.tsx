"use client";

import { PagePagination } from "@/components/pagination/PagePagination";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCollectionsQuery } from "@/redux/features/collection/collectionApi";
import {
  setIsLoading,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { columns } from "./CollectionColumns";
const CollectionTable = () => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector(({ pagination }) => pagination);

  // When searching (globalFilter is set), we might want to bypass pagination or query differently.
  // For now, let's just pass page/limit for standard view.
  // Ideally, if globalFilter is present, we might want to reset page to 1 or handle search params.
  // But based on user request "implementation this pagination in collection {!search && ...}",
  // they specifically want to HIDE pagination during search (client-side search?).

  // However, existing code fetches ALL collections: useGetCollectionsQuery({}).
  // This suggests client side pagination was used previously?
  // "const collections = Array.isArray(responseData?.data) ? responseData.data : []"

  // If we want server pagination, we pass page/limit.
  // If we search, usually we assume client search on the fetched page? NO, that would be weird.
  // If we want FULL collection search, we need backend search.
  // But let's stick to the prompt: just adding pagination support.

  const [globalFilter, setGlobalFilter] = useState("");

  const queryParams = globalFilter
    ? { searchTerm: globalFilter }
    : { page, limit };

  const { data: response, isLoading } = useGetCollectionsQuery(queryParams);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const responseData: any = response?.data;
  const collections = Array.isArray(responseData?.data)
    ? responseData.data
    : [];
  const meta = responseData?.meta;

  if (!collections.length && page > 1) {
    dispatch(setPage(1));
  }

  useEffect(() => {
    if (meta) {
      dispatch(setTotalPage({ total: meta.total, totalPage: meta.totalPage }));
    }
  }, [meta, dispatch]);

  useEffect(() => {
    dispatch(setIsLoading(isLoading));
  }, [isLoading, dispatch]);

  const table = useReactTable({
    data: collections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // This might still limit strictly to page size if collections > limit, but server handles it.
    initialState: {
      pagination: {
        pageSize: limit,
      },
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: !globalFilter, // If not searching, we handle pagination manually (server side effectively)
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Input
          placeholder="Search collections..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-primary text-white hover:bg-primary/90">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-primary/90">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                  No collections found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!globalFilter && (
        <div className="flex items-center justify-end space-x-2 py-2">
          <PagePagination />
        </div>
      )}
    </div>
  );
};

export default CollectionTable;

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
import { useDebounce } from "@/hooks/useDebounce";
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
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { columns } from "./CollectionColumns";

const CollectionTable = () => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector(({ pagination }) => pagination);

  const [globalFilter, setGlobalFilter] = React.useState("");
  const debunce = useDebounce(globalFilter, 500);
  const queryParams = debunce ? { search: debunce } : { page, limit };

  const { data: response, isLoading } = useGetCollectionsQuery(queryParams);

  const collections = response?.data?.data || [];
  const meta = response?.data?.meta;

  if (!collections.length && page > 1) {
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
    data: collections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row._id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

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

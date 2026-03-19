"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetHomepageSectionsQuery } from "@/redux/features/homepageSection/homepageSectionApi";
import {
  setIsLoading,
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
import { columns } from "./HomepageSectionColumns";

const HomepageSectionTable = () => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector(({ pagination }) => pagination);
  const [globalFilter, setGlobalFilter] = useState("");

  const queryParams = globalFilter
    ? { searchTerm: globalFilter }
    : { page, limit };

  const { data: response, isLoading } =
    useGetHomepageSectionsQuery(queryParams);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const responseData: any = response?.data;
  const homepageSections = Array.isArray(responseData) ? responseData : [];
  const meta = responseData?.meta;

  useEffect(() => {
    if (meta) {
      dispatch(setTotalPage({ total: meta.total, totalPage: meta.totalPage }));
    }
  }, [meta, dispatch]);

  useEffect(() => {
    dispatch(setIsLoading(isLoading));
  }, [isLoading, dispatch]);

  const table = useReactTable({
    data: homepageSections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: limit,
      },
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: !globalFilter,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-primary text-white hover:bg-primary/90">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-primary/90">
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
                  No homepage sections found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HomepageSectionTable;

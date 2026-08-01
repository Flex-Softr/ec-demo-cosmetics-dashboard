"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { getColumns, TContactMessage } from "./ContactMessagesColumn";

type ContactMessagesTableBaseProps = {
  data: TContactMessage[];
  isLoading: boolean;
  isFetching: boolean;
  onView: (message: TContactMessage) => void;
  onDelete: (id: string) => void;
  page: number;
  limit: number;
};

export const ContactMessagesTableBase = ({
  data,
  isLoading,
  isFetching,
  onView,
  onDelete,
  page,
  limit,
}: ContactMessagesTableBaseProps) => {
  const columns = React.useMemo<ColumnDef<TContactMessage>[]>(
    () => getColumns(onView, onDelete, page, limit),
    [onView, onDelete, page, limit]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row._id,
  });

  if (isLoading && !data.length) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground">
        Loading messages…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border hover:bg-muted"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                  >
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
            {isFetching && !table.getRowModel().rows?.length ? (
              Array.from({ length: Math.min(limit, 5) }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={columns.length} className="p-0">
                    <div className="h-14 animate-pulse bg-muted/40" />
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`border-b border-border transition-colors hover:bg-muted/40 ${
                    !row.original.isRead ? "bg-primary/5 font-medium" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
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
                  No contact messages found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

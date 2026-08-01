"use client";

import { PagePagination } from "@/components/pagination/PagePagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppSelector } from "@/redux/hooks";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import columns from "./CouponsColumn";

const CouponsClaimTable = () => {
  const { codes, isLoading } = useAppSelector(({ allCoupons }) => allCoupons);
  const table = useReactTable({
    data: codes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground">
        Loading coupons…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table className="w-full whitespace-nowrap">
          <TableHeader className="bg-muted">
            {table?.getHeaderGroups()?.map((headerGroup) => (
              <TableRow
                key={headerGroup?.id}
                className="border-b border-border hover:bg-muted"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header?.id}
                    className="py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {header?.isPlaceholder
                      ? null
                      : flexRender(
                          header?.column?.columnDef?.header,
                          header?.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {codes?.length ? (
              table?.getRowModel()?.rows?.map((row) => (
                <TableRow
                  key={row?.id}
                  data-state={row?.getIsSelected() && "selected"}
                  className="border-b border-border"
                >
                  {row?.getVisibleCells()?.map((cell) => (
                    <TableCell key={cell?.id} className="py-3">
                      {flexRender(
                        cell?.column?.columnDef?.cell,
                        cell?.getContext()
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
                  No coupons found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end py-1">
        <PagePagination />
      </div>
    </div>
  );
};

export default CouponsClaimTable;

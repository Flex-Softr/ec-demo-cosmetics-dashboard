"use client";
import OrdersTableSkeleton from "@/components/skeleton/OrdersTableSkeleton";
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
import columns from "./ImgToOrderColumn";

const ImgToOrderTable = () => {
  const { allRequests, isLoading } = useAppSelector(
    ({ imageToOrder }) => imageToOrder
  );
  const table = useReactTable({
    data: allRequests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table className="w-full">
        <TableHeader className="bg-muted">
          {table?.getHeaderGroups()?.map((headerGroup) => (
            <TableRow
              key={headerGroup?.id}
              className="border-b border-border hover:bg-muted"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header?.id}
                    className="py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {header?.isPlaceholder
                      ? null
                      : flexRender(
                          header?.column?.columnDef?.header,
                          header?.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <OrdersTableSkeleton columns={columns.length} rows={6} />
          ) : allRequests?.length ? (
            table?.getRowModel()?.rows?.map((row) => (
              <TableRow
                key={row?.id}
                data-state={row?.getIsSelected() && "selected"}
                className="border-b border-border"
              >
                {row?.getVisibleCells()?.map((cell) => (
                  <TableCell key={cell?.id} className="py-3 text-center">
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
                No image to order found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ImgToOrderTable;

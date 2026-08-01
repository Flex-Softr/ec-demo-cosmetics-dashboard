"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SliderTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/sliderTable";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useGetSlidersQuery } from "@/redux/features/sliderBanner/sliderApi";
import columns from "./SliderMediaColumn";

const SliderMediaTable = () => {
  const { data: slider, isLoading } = useGetSlidersQuery(undefined);

  const table = useReactTable({
    data: slider?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <SliderTable className="w-full">
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
          {slider?.data?.length ? (
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
                No slider found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </SliderTable>
    </div>
  );
};

export default SliderMediaTable;

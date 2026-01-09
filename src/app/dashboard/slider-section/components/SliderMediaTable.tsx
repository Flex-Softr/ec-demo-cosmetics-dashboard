"use client";
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
import columns from "./SliderMediaColumn";

export type TSlider = {
  _id: string;
  name: string;
  image: {
    _id: string;
    src: string;
  };
  isActive: boolean;
  bannerLink?: string;
  sortOrder: number;
};

import { useGetSlidersQuery } from "@/redux/features/sliderBanner/sliderApi";

const SliderMediaTable = () => {
  const { data: slider, isLoading } = useGetSlidersQuery(undefined);

  const table = useReactTable({
    data: slider?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <SliderTable className="w-full">
        <TableHeader className="bg-primary text-white">
          {table?.getHeaderGroups()?.map((headerGroup) => (
            <TableRow key={headerGroup?.id} className="hover:bg-muted/0">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header?.id} className="text-center">
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
                className="border-b"
              >
                {row?.getVisibleCells()?.map((cell) => (
                  <TableCell key={cell?.id} className="text-center">
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No Slider found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </SliderTable>
    </div>
  );
};

export default SliderMediaTable;

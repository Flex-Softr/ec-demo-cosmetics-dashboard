"use client";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatImageSrc } from "@/lib/utils";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import * as React from "react";
import CategoryAction from "./CategoryAction";
import NavigateSubCategory from "./NavigateSubCategory";
import UpdateCategoryActiveStatus from "./UpdateCategoryActiveStatus";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setIsLoading,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { PagePagination } from "@/components/pagination/PagePagination";
import { useDebounce } from "@/hooks/useDebounce";

export type TCategories = {
  _id: string;
  image: {
    src: string;
    alt: string;
  };
  name: string;
  isActive: boolean;
  subcategories: [];
};

export const columns: ColumnDef<TCategories>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => (
      <Image
        width={50}
        height={50}
        src={formatImageSrc(row.original.image?.src)}
        alt={row?.original?.name}
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "items",
    header: "Sub Categories",
    cell: ({ row }) => <NavigateSubCategory category={row.original} />,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => <UpdateCategoryActiveStatus category={row.original} />,
  },
  {
    id: "_id",
    accessorKey: "_id",
    header: () => <div className="text-center">Action</div>,
    enableHiding: true,
    cell: ({ row }) => <CategoryAction category={row.original} />,
  },
];

export const CategoryTable = () => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector(({ pagination }) => pagination);

  const [globalFilter, setGlobalFilter] = React.useState("");
  const debunce = useDebounce(globalFilter, 500);
  const queryParams = debunce ? { search: debunce } : { page, limit };

  const { data: response, isLoading } = useGetCategoriesQuery(queryParams);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const responseData: any = response?.data;
  const categories = Array.isArray(responseData?.data) ? responseData.data : [];
  const meta = responseData?.meta;

  if (!categories.length && page > 1) {
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
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Input
          placeholder="Search categories..."
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
                  No categories found.
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

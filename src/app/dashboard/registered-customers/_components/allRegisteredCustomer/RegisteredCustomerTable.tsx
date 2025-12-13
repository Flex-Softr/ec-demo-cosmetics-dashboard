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
import columns from "./RegisteredCustomerColumn";

const RegisteredCustomerTable = () => {
  const { users } = useAppSelector(
    ({ registeredCustomer }) => registeredCustomer
  );
  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="rounded-lg overflow-hidden">
      <Table className="w-full">
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
          {users?.length ? (
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
                No user found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-2">
        <PagePagination />
      </div>
    </div>
  );
};

export default RegisteredCustomerTable;

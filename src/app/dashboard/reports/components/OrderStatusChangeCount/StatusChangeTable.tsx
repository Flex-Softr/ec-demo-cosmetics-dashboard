import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TOrderStatusChangeCount } from "@/types/reports/period";

export const columns: ColumnDef<TOrderStatusChangeCount>[] = [
  {
    accessorKey: "",
    header: () => <h4 className="text-center">SL. No.</h4>,
    id: "sl",
    cell: ({ row }) => (
      <div className="capitalize flex flex-col justify-center items-center">
        <span>{row.index + 1}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div className="capitalize">{row.original.status}</div>,
  },
  {
    accessorKey: "count",
    header: "Total order",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.count}</div>;
    },
  },
];

const StatusChangeTable = ({
  statusChangeCountData,
  isLoading,
}: {
  statusChangeCountData: TOrderStatusChangeCount[];
  isLoading: boolean;
}) => {
  const table = useReactTable({
    data: statusChangeCountData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-md border overflow-hidden">
        <Table className="min-w-[500px]">
          <TableHeader className="bg-primary text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-muted/0">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-start">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="max-h-[521.5px] overflow-x-scroll">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-start">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <TableSkeleton />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No orders
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StatusChangeTable;

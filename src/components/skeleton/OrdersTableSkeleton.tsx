import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

type OrdersTableSkeletonProps = {
  rows?: number;
  /** Number of columns to render. Prefer matching the live table. */
  columns?: number;
};

/**
 * Renders proper <tr> skeleton rows for order tables.
 * Must be used as a direct child of <tbody> (not inside a single cell).
 */
const OrdersTableSkeleton = ({
  rows = 8,
  columns = 11,
}: OrdersTableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="border-b border-border">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex} className="py-3">
              <SkeletonCell colIndex={colIndex} columns={columns} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

function SkeletonCell({
  colIndex,
  columns,
}: {
  colIndex: number;
  columns: number;
}) {
  // First column: checkbox
  if (colIndex === 0) {
    return <Skeleton className="mx-auto h-4 w-4 rounded-sm" />;
  }
  // SL
  if (colIndex === 1) {
    return <Skeleton className="mx-auto h-4 w-6" />;
  }
  // Last column: actions
  if (colIndex === columns - 1) {
    return <Skeleton className="mx-auto h-8 w-8 rounded-lg" />;
  }
  // Status / payment / origin-like short pills (near end)
  if (colIndex >= columns - 4 && colIndex < columns - 1) {
    return <Skeleton className="mx-auto h-5 w-16 rounded-full" />;
  }
  // Multi-line content cells (order id, customer, product)
  if (colIndex <= 4) {
    return (
      <div className="mx-auto flex w-fit flex-col items-center gap-1.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-20" />
        {colIndex === 3 ? <Skeleton className="h-3 w-28" /> : null}
      </div>
    );
  }
  // Total / simple cells
  return <Skeleton className="mx-auto h-4 w-14" />;
}

export default OrdersTableSkeleton;

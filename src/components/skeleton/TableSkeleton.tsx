import { Skeleton } from "@/components/ui/skeleton";

/** Generic block skeleton for non-table loading states. */
const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="w-full space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-12 w-full rounded-lg ${i % 2 === 0 ? "opacity-100" : "opacity-70"}`}
        />
      ))}
    </div>
  );
};

export default TableSkeleton;

"use client";
import { Button } from "@/components/ui/button";
import {
  setLimit,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { setSelectedStatus } from "@/redux/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/utils";

const statusTone: Record<string, string> = {
  all: "border-border text-foreground",
  published: "border-emerald-200 text-emerald-700",
  draft: "border-amber-200 text-amber-700",
  pending: "border-sky-200 text-sky-700",
  archived: "border-slate-200 text-slate-600",
};

const CountByStatusButtons = () => {
  const dispatch = useAppDispatch();
  const { limit, isLoading } = useAppSelector(({ pagination }) => pagination);
  const { selectedStatus: filter, countsByStatus } = useAppSelector(
    ({ products }) => products
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {countsByStatus?.map((status: { name: string; total: number }) => {
        const isActive = filter === status.name;
        const tone = statusTone[status.name] ?? "border-border text-foreground";

        return (
          <Button
            key={status.name}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              dispatch(setTotalPage({ total: status.total }));
              dispatch(setLimit(limit));
              dispatch(setSelectedStatus(status.name));
              dispatch(setPage(1));
            }}
            disabled={isLoading}
            className={cn(
              "h-8 rounded-lg border capitalize gap-1.5 px-3 text-xs font-medium shadow-none",
              tone,
              isActive
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-card hover:bg-muted"
            )}
          >
            <span>{status.name}</span>
            <span className="text-[11px] opacity-80">({status.total})</span>
          </Button>
        );
      })}
    </div>
  );
};

export default CountByStatusButtons;

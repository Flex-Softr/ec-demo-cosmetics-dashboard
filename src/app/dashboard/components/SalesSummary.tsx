"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrdersSummaryQuery } from "@/redux/features/dashboard/dashboardApi";

const metrics = [
  { key: "today_order_value" as const, label: "Today" },
  { key: "week_order_value" as const, label: "This Week" },
  { key: "month_order_value" as const, label: "This Month" },
  { key: "total_orders_count" as const, label: "Total Orders", plain: true },
  { key: "avg_order_value" as const, label: "Avg. Order" },
  { key: "total_order_value" as const, label: "Total Value" },
];

const SalesSummary = () => {
  const { data, isLoading } = useGetOrdersSummaryQuery();
  const summary = data?.data;

  return (
    <div className="rounded-xl border bg-white/50 backdrop-blur-sm overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-border">
        {metrics.map((m) =>
          isLoading ? (
            <div key={m.key} className="p-4 space-y-2">
              <Skeleton className="w-16 h-3" />
              <Skeleton className="w-20 h-5" />
            </div>
          ) : (
            <div key={m.key} className="p-4 space-y-1">
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                {m.label}
              </p>
              <p className="text-lg font-bold text-gray-900">
                {!m.plain && "৳"}
                {Number(summary?.[m.key] ?? 0).toLocaleString()}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SalesSummary;

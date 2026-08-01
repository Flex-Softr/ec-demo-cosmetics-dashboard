"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetShippingStatusCountQuery } from "@/redux/features/dashboard/dashboardApi";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  count: {
    label: "Shipments",
    color: "#10b981",
  },
};

const formatStatusLabel = (status: string) =>
  status
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const ShippingStatus = () => {
  const { data: res, isLoading } = useGetShippingStatusCountQuery();
  const bookingStatus = res?.data ?? [];
  const [all, ...chartData] = bookingStatus.map((item) => ({
    ...item,
    status: formatStatusLabel(item.status),
  }));

  return (
    <div className="rounded-xl border bg-white/50 backdrop-blur-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row items-stretch border-b">
        <div className="flex-1 px-5 py-4">
          <p className="text-sm font-semibold text-gray-900">Shipping Status</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Overview of current shipping statuses
          </p>
        </div>
        <div className="border-t sm:border-t-0 sm:border-l px-5 py-4 flex flex-col justify-center min-w-[100px]">
          {isLoading ? (
            <>
              <Skeleton className="w-10 h-3 mb-1.5" />
              <Skeleton className="w-16 h-6" />
            </>
          ) : (
            <>
              <span className="text-[11px] text-gray-500 uppercase tracking-wide">
                Total
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {all?.count?.toLocaleString() ?? 0}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <div className="flex gap-2 items-end">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-8 rounded-sm"
                  style={{ height: `${50 + i * 30}px` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} strokeOpacity={0.5} />
              <XAxis
                dataKey="status"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent className="w-[140px]" nameKey="status" />
                }
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
};

export default ShippingStatus;

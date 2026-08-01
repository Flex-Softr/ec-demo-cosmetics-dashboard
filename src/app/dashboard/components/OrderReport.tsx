"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrderReportQuery } from "@/redux/features/dashboard/dashboardApi";
import { TOrderReportFilter } from "@/redux/features/dashboard/dashboardInterface";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

const chartConfig = {
  count: {
    label: "Orders",
    color: "#3b82f6",
  },
};

export const orderReportFilterOptions = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
] as const;

const OrderReport = () => {
  const [filter, setFilter] = useState<TOrderReportFilter>("monthly");
  const { data: bookingDataRes, isLoading } = useGetOrderReportQuery(filter);
  const bookingData = bookingDataRes?.data;

  return (
    <div className="rounded-xl border bg-white/50 backdrop-blur-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row items-stretch border-b">
        <div className="flex-1 px-5 py-4">
          <p className="text-sm font-semibold text-gray-900">Order Report</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing total orders over time
          </p>
        </div>
        <div className="border-t sm:border-t-0 sm:border-l px-4 py-3 flex items-center">
          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as TOrderReportFilter)}
          >
            <SelectTrigger className="w-[140px] h-9 rounded-lg capitalize text-sm">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              {orderReportFilterOptions.map((i) => (
                <SelectItem className="capitalize" key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center">
            <div className="flex gap-1 items-end">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-5 rounded-sm"
                  style={{ height: `${30 + Math.sin(i) * 20 + i * 8}px` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart data={bookingData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} strokeOpacity={0.5} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent className="w-[150px]" nameKey="count" />
                }
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="var(--color-count)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
};

export default OrderReport;

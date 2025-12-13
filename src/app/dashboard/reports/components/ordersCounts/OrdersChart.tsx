"use client";
import DateRangeSelector, {
  TDateRangeSelectorHandlerFN,
} from "@/components/DateRangeSelector";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TReportOrdersCount } from "@/redux/features/reports/reportsInterface";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
const chartConfig = {
  visitors: {
    label: "Orders",
  },

  count: {
    label: "Orders",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const OrdersChart = ({
  ordersCount,
  handlerFN,
}: {
  ordersCount: TReportOrdersCount[];
  handlerFN: (payload: TDateRangeSelectorHandlerFN) => void;
}) => {
  const chartData = ordersCount;
  const type = chartData![0]?.name;
  return (
    <Card className="mt-5 rounded-lg shadow-none">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Orders</CardTitle>
          <CardDescription>Showing total orders</CardDescription>
        </div>
        <DateRangeSelector
          handlerFN={handlerFN}
          selectedPeriod="Today"
          displayDate={true}
          disableFirstOPT={true}
        />
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="count" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-count)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-count)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="id"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                if (type === "month") {
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                  });
                } else if (type === "day") {
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                } else {
                  return value;
                }
              }}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    if (type === "month") {
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                      });
                    } else if (type === "day") {
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    } else {
                      return value;
                    }
                  }}
                  indicator="dot"
                  active={true}
                />
              }
            />
            <Area
              dataKey="count"
              type="natural"
              fill="url(#count)"
              stroke="var(--color-desktop)"
              stackId="add"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default OrdersChart;

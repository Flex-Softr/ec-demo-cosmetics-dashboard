"use client";

import DateRangeSelector, {
  TDateRangeSelectorHandlerFN,
} from "@/components/DateRangeSelector";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { TReportPlatformCount } from "@/redux/features/reports/reportsInterface";
import { Pie, PieChart } from "recharts";

const SalesByPlatformChart = ({
  handlerFN,
  salesByPlatformCounts,
}: {
  handlerFN: (payload: TDateRangeSelectorHandlerFN) => void;
  salesByPlatformCounts: TReportPlatformCount[];
}) => {
  const chartData2 = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartConfig2: any = {
    count: {
      label: "count",
    },
  };

  for (let i = 0; i < salesByPlatformCounts.length; i++) {
    const salesByPlatformCount = salesByPlatformCounts[i];
    chartData2.push({
      ...salesByPlatformCount,
      source: salesByPlatformCount.source.split(" ").join("-"),
      fill: `var(--color-${salesByPlatformCount.source.split(" ").join("-")})`,
    });
    chartConfig2[salesByPlatformCount.source.split(" ").join("-")] = {
      label: `${salesByPlatformCount.source} - ${salesByPlatformCount.count} - ${salesByPlatformCount.percentage}%`,
      color: `hsl(var(--chart-${i + 1}))`,
    };
  }

  return (
    <Card className="p-4 shadow-none rounded-xl">
      <div className="flex flex-col">
        <div className="flex justify-end">
          <DateRangeSelector
            handlerFN={handlerFN}
            selectedPeriod="All time"
            displayDate={true}
            disableFirstOPT={true}
            showAllTime
          />
        </div>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig2}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <Pie data={chartData2} dataKey="count" />
              <ChartLegend
                content={<ChartLegendContent className="" nameKey="source" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </div>
    </Card>
  );
};

export default SalesByPlatformChart;

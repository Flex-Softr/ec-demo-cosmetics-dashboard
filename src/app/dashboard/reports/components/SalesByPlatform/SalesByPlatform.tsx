"use client";

import { TDateRangeSelectorHandlerFN } from "@/components/DateRangeSelector";
import { Card } from "@/components/ui/card";
import { useGetOrdersByPlatformCountQuery } from "@/redux/features/reports/reportsApi";
import { TReportPlatformCount } from "@/redux/features/reports/reportsInterface";
import { TSuccessResponse } from "@/types/response/response";
import { useState } from "react";
import SalesByPlatformChart from "./SalesByPlatformChart";
const SalesByPlatform = () => {
  const [query, setQuery] = useState<{
    type: string;
    startDate?: string;
    endDate?: string;
    customDate?: string;
  }>({
    type: "allTime",
    startDate: undefined,
    endDate: undefined,
  });
  const { data } = useGetOrdersByPlatformCountQuery(query);
  const salesByPlatformCounts =
    (data as TSuccessResponse<TReportPlatformCount[]>)?.data || [];

  const handlerFN = (payload: TDateRangeSelectorHandlerFN) => {
    const { selectedPeriod, start, end } = payload;
    if (selectedPeriod === "Select date") return;
    setQuery({
      type: selectedPeriod,
      customDate: start,
      startDate: start,
      endDate: end,
    });
  };
  return (
    <div>
      <Card className="p-4 shadow-none rounded-xl space-y-5">
        <h2 className="text-xl font-bold">Orders by platform</h2>
        <hr className="!mt-2" />
        <SalesByPlatformChart
          handlerFN={handlerFN}
          salesByPlatformCounts={salesByPlatformCounts}
        />
      </Card>
    </div>
  );
};

export default SalesByPlatform;

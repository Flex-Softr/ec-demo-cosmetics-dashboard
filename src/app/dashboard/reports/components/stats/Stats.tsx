"use client";

import DateRangeSelector, {
  TDateRangeSelectorHandlerFN,
} from "@/components/DateRangeSelector";
import { useGetStatsQuery } from "@/redux/features/reports/reportsApi";
import { TStats } from "@/redux/features/reports/reportsInterface";
import { TSuccessResponse } from "@/types/response";
import { useState } from "react";
import StatsCard from "./StatsCard";
const Stats = () => {
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

  const handleDateChange = (payload: TDateRangeSelectorHandlerFN) => {
    const { selectedPeriod, start, end } = payload;

    if (selectedPeriod === "Select date") return;
    setQuery({
      type: selectedPeriod,
      customDate: start,
      startDate: start,
      endDate: end,
    });
  };
  const { data } = useGetStatsQuery(query);
  const stats = (data as TSuccessResponse<TStats[]>)?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DateRangeSelector
          handlerFN={handleDateChange}
          selectedPeriod="All time"
          displayDate={true}
          disableFirstOPT={true}
          showAllTime
        />
      </div>
      <div className="grid grid-cols-3 gap-5">
        {stats.map((stat) => (
          <StatsCard key={stat.name} stat={stat} />
        ))}
      </div>
    </div>
  );
};

export default Stats;

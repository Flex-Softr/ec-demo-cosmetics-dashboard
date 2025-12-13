"use client";

import { TDateRangeSelectorHandlerFN } from "@/components/DateRangeSelector";
import { Card } from "@/components/ui/card";
import { useGetOrdersCountQuery } from "@/redux/features/reports/reportsApi";
import { TReportOrdersCount } from "@/redux/features/reports/reportsInterface";
import { TSuccessResponse } from "@/types/response/response";
import { useState } from "react";
import OrdersChart from "./OrdersChart";

const OrdersCount = () => {
  const [query, setQuery] = useState<{
    type: string;
    startDate?: string;
    endDate?: string;
    customDate?: string;
  }>({
    type: "today",
    startDate: undefined,
    endDate: undefined,
  });
  const { data } = useGetOrdersCountQuery(query);
  const ordersCount =
    (data as TSuccessResponse<TReportOrdersCount[]>)?.data || [];

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

  return (
    <div className="col-span-2">
      <Card className="p-4 shadow-none rounded-xl">
        <h2 className="text-xl font-bold mb-2">Orders</h2>
        <hr />
        <OrdersChart ordersCount={ordersCount} handlerFN={handleDateChange} />
      </Card>
    </div>
  );
};

export default OrdersCount;

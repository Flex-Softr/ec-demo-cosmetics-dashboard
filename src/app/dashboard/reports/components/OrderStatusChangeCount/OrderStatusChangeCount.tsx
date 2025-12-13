"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetOrderStatusChangeCountQuery } from "@/redux/features/reports/reportsApi";
import { TOrderStatusChangeCount } from "@/types/reports/period";
import { TSuccessResponse } from "@/types/response/response";
import { format } from "date-fns";
import { useState } from "react";
import StatusChangeTable from "./StatusChangeTable";
const OrderStatusChangeCount = () => {
  const defaultSelectedValue = format(new Date(), "yyyy-MM-dd");
  const [query, setQuery] = useState<string>(defaultSelectedValue);
  const [date, setDate] = useState<Date>(new Date(defaultSelectedValue));
  const [open, setOpen] = useState<boolean>(false);
  const { data, isLoading } = useGetOrderStatusChangeCountQuery(query);
  const statusChangeCountData =
    (data as TSuccessResponse<TOrderStatusChangeCount[]>)?.data || [];

  const handleDate = (date?: Date) => {
    const selectedDate = date || new Date();
    setDate(selectedDate);
    setOpen(false);
    setQuery(format(selectedDate, "yyyy-MM-dd"));
  };
  return (
    <div>
      <Card className="p-4 shadow-none rounded-xl space-y-5">
        <h2 className="text-xl font-bold">Order status change count</h2>
        <hr className="!mt-2" />
        <div className="flex justify-end">
          <Popover open={open}>
            <PopoverTrigger asChild>
              <Button
                onClick={() => setOpen((prev) => !prev)}
                variant="outline"
              >
                {date ? format(date, "dd MMM, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <StatusChangeTable
          statusChangeCountData={statusChangeCountData}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default OrderStatusChangeCount;

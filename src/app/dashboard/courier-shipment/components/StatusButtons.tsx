"use client";
import { Button } from "@/components/ui/button";
import { useGetProcessingDoneAndCourierOrdersQuery } from "@/redux/features/courierShipment/courierShipmentApi";
import {
  setProcessingDoneOrders,
  setSelectedStatus,
} from "@/redux/features/courierShipment/courierShipmentSlice";
import {
  setIsLoading,
  setLimit,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import {
  setSearch,
  setSearchQuery,
  setSearchedOrders,
} from "@/redux/features/search/searchSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { statusChipClass } from "@/lib/tableStyles";
import { useEffect, useState } from "react";
// import DateRangeSelector from "@/components/DateRangeSelector";

const StatusButtons = () => {
  const dispatch = useAppDispatch();
  const { page, limit, isLoading } = useAppSelector(
    ({ pagination }) => pagination
  );
  const { startFrom, endAt } = useAppSelector(({ orders }) => orders);
  const { selectedStatus: filter, processingDoneOrders } = useAppSelector(
    ({ courierShipment }) => courierShipment
  );
  if (!processingDoneOrders.length && page > 1) {
    dispatch(setPage(1));
  }
  const [orderStatusCount, setOrderStatusCount] = useState([]);
  const {
    data,
    isLoading: loading,
    error,
  } = useGetProcessingDoneAndCourierOrdersQuery({
    status: filter,
    startFrom,
    endAt,
    sort: "-createdAt",
    page,
    limit,
  });

  useEffect(() => {
    if (loading) {
      dispatch(setIsLoading(true));
    }
    if (data) {
      const { meta, data: orders } = data;
      dispatch(setTotalPage(meta));
      setOrderStatusCount(orders?.countsByStatus);
      dispatch(setProcessingDoneOrders(orders?.data));
      dispatch(setSearch(false));
      dispatch(setSearchQuery(""));
      dispatch(setSearchedOrders([]));
      dispatch(setIsLoading(false));
    }
    if (error) {
      throw new Error("Something went wrong!");
    }
  }, [data, loading, error, dispatch]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {orderStatusCount?.map((status: { name: string; total: string }) => {
        return (
          <Button
            key={status.name}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              dispatch(setPage(1));
              dispatch(setLimit(limit));
              dispatch(setSelectedStatus(status.name));
            }}
            disabled={isLoading}
            className={statusChipClass(filter === status.name)}
          >
            <span>{status.name}</span>
            <span className="text-[11px] opacity-80">({status.total})</span>
          </Button>
        );
      })}
    </div>
  );
};

export default StatusButtons;

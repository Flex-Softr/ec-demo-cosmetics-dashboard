"use client";
import { Button } from "@/components/ui/button";
import {
  setIsLoading,
  setLimit,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetProcessingOrdersQuery } from "@/redux/features/processingOrders/processingOrdersApi";
import {
  setProcessingOrders,
  setSelectedStatus,
} from "@/redux/features/processingOrders/processingOrdersSlice";
import {
  setSearch,
  setSearchQuery,
  setSearchedOrders,
} from "@/redux/features/search/searchSlice";
import { statusChipClass } from "@/lib/tableStyles";
import { useEffect, useState } from "react";

const ProcessingOrdersStatusButtons = () => {
  const dispatch = useAppDispatch();
  const { page, limit, isLoading } = useAppSelector(
    ({ pagination }) => pagination
  );
  const { startFrom, endAt } = useAppSelector(({ orders }) => orders);
  const { selectedStatus: filter, processingOrders } = useAppSelector(
    ({ processingOrders }) => processingOrders
  );

  if (!processingOrders.length && page > 1) {
    dispatch(setPage(1));
  }

  const [orderStatusCount, setOrderStatusCount] = useState([]);
  const {
    data,
    isFetching: loading,
    error,
  } = useGetProcessingOrdersQuery({
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
    if (!loading && data) {
      const { meta, data: orders } = data;

      const hidestatus = ["warranty processing", "warranty added"];
      const filteredCount = orders?.countsByStatus.filter(
        (s: { name: string; total: string }) => !hidestatus.includes(s.name)
      );

      dispatch(setTotalPage(meta));
      setOrderStatusCount(filteredCount);
      dispatch(setProcessingOrders(orders?.data));
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

export default ProcessingOrdersStatusButtons;

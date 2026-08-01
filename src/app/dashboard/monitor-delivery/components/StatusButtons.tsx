"use client";
import { Button } from "@/components/ui/button";
import { useGetMonitorDeliveryOrdersQuery } from "@/redux/features/monitorDelivery/monitorDeliveryApi";
import {
  setCountsByCourier,
  setMonitorDeliveryOrders,
  setSelectedStatus,
} from "@/redux/features/monitorDelivery/monitorDeliverySlice";
import {
  setIsLoading,
  setLimit,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import {
  setSearch,
  setSearchedOrders,
  setSearchQuery,
} from "@/redux/features/search/searchSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { statusChipClass } from "@/lib/tableStyles";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StatusButtons = ({ manageProcessing }: { manageProcessing: boolean }) => {
  const dispatch = useAppDispatch();

  const { page, limit, isLoading } = useAppSelector(
    ({ pagination }) => pagination
  );

  const { startFrom, endAt } = useAppSelector(({ orders }) => orders);

  const {
    selectedStatus: filter,
    monitorDeliveryOrders,
    selectedCourierId,
  } = useAppSelector(({ monitorDelivery }) => monitorDelivery);

  if (!monitorDeliveryOrders.length && page > 1) {
    dispatch(setPage(1));
  }

  const [orderStatusCount, setOrderStatusCount] = useState([]);

  const {
    data,
    isLoading: loading,
    error,
  } = useGetMonitorDeliveryOrdersQuery({
    deliveryStatus: filter === "all" ? "" : filter,
    courierId: selectedCourierId || "",
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
      dispatch(setCountsByCourier(orders?.countsByCourier || []));
      dispatch(setMonitorDeliveryOrders(orders?.data));
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
    <>
      {orderStatusCount?.map((status: { name: string; total: string }) => {
        return (
          <Button
            size="sm"
            type="button"
            variant="outline"
            key={status.name}
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
    </>
  );
};

export default StatusButtons;

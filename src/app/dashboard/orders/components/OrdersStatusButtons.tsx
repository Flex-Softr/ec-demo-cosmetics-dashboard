"use client";
import { Button } from "@/components/ui/button";
import {
  setOrders,
  setSelectedStatus,
} from "@/redux/features/orders/ordersSlice";
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
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useEffect, useState } from "react";

const OrdersStatusButtons = () => {
  const dispatch = useAppDispatch();
  const { page, limit, isLoading } = useAppSelector(
    ({ pagination }) => pagination
  );
  const {
    selectedStatus: filter,
    orders,
    startFrom,
    endAt,
  } = useAppSelector(({ orders }) => orders);

  if (!orders.length && page > 1) {
    dispatch(setPage(1));
  }
  const [orderStatusCount, setOrderStatusCount] = useState([]);
  const {
    data,
    isLoading: loading,
    error,
  } = useGetAllOrdersQuery({
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
      dispatch(setOrders(orders?.data));
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
              dispatch(setTotalPage({ total: status.total }));
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

export default OrdersStatusButtons;

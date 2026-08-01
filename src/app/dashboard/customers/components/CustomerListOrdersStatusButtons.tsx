"use client";
import { Button } from "@/components/ui/button";
import { useGetCompletedOrdersQuery } from "@/redux/features/completedOrders/completedOrdersApi";
import {
  setCompletedOrders,
  setSelectedStatus,
} from "@/redux/features/completedOrders/completedOrdersSlice";
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
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const statusTone: Record<string, string> = {
  all: "border-border text-foreground",
  completed: "border-emerald-200 text-emerald-700",
  delivered: "border-emerald-200 text-emerald-700",
  canceled: "border-red-200 text-red-700",
  cancelled: "border-red-200 text-red-700",
  pending: "border-amber-200 text-amber-700",
  processing: "border-sky-200 text-sky-700",
  returned: "border-slate-200 text-slate-600",
};

const CustomerListOrdersStatusButtons = () => {
  const dispatch = useAppDispatch();
  const { page, limit, isLoading } = useAppSelector(
    ({ pagination }) => pagination
  );
  const { startFrom, endAt } = useAppSelector(({ orders }) => orders);
  const {
    selectedStatus,
    selectedProduct,
    selectedTimes,
    selectedSource,
    selectedUpazila,
    selectedDistrict,
    selectedDivision,
    completedOrders,
  } = useAppSelector(({ completedOrders }) => completedOrders);

  if (!completedOrders.length && page > 1) {
    dispatch(setPage(1));
  }

  const [orderStatusCount, setOrderStatusCount] = useState([]);

  const {
    data,
    isLoading: loading,
    error,
  } = useGetCompletedOrdersQuery({
    status: selectedStatus,
    orderedTimes: selectedTimes,
    orderSource: selectedSource,
    productIds: selectedProduct,
    upazila: selectedUpazila,
    district: selectedDistrict,
    division: selectedDivision,
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
      dispatch(setCompletedOrders(orders?.data));
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
        const isActive = selectedStatus === status.name;
        const tone =
          statusTone[status.name?.toLowerCase?.() || status.name] ??
          "border-border text-foreground";

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
            className={cn(
              "h-8 rounded-lg border capitalize gap-1.5 px-3 text-xs font-medium shadow-none",
              tone,
              isActive
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-card hover:bg-muted"
            )}
          >
            <span>{status.name}</span>
            <span className="text-[11px] opacity-80">({status.total})</span>
          </Button>
        );
      })}
    </div>
  );
};

export default CustomerListOrdersStatusButtons;

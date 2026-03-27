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
import backgroundColor from "@/utilities/backgroundColor";
import borderColor from "@/utilities/borderColor";
import { useEffect, useState } from "react";
// import DateRangeSelector from "@/components/DateRangeSelector";

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
    <div className="flex flex-wrap items-center justify-start gap-5">
      {orderStatusCount?.map((status: { name: string; total: string }) => {
        const bg = `${backgroundColor(status.name)} text-white`;
        return (
          <Button
            key={status.name}
            onClick={() => {
              dispatch(setPage(1));
              dispatch(setLimit(limit));
              dispatch(setSelectedStatus(status.name));
            }}
            disabled={isLoading}
            className={`capitalize bg-white flex items-center gap-1 rounded-2xl ${borderColor(status.name)} ${selectedStatus === status.name ? bg : "text-black"}`}
          >
            <span>{status.name}</span>
            <span>({status.total})</span>
          </Button>
        );
      })}
      {/* <div>
        <DateRangeSelector />
      </div> */}
    </div>
  );
};

export default CustomerListOrdersStatusButtons;

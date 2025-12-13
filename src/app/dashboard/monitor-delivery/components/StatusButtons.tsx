"use client";
import { Button } from "@/components/ui/button";
import {
  setIsLoading,
  setLimit,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import {
  setMonitorDeliveryOrders,
  setSelectedStatus,
} from "@/redux/features/monitorDelivery/monitorDeliverySlice";
import borderColor from "@/utilities/borderColor";
import backgroundColor from "@/utilities/backgroundColor";
import {
  setSearch,
  setSearchQuery,
  setSearchedOrders,
} from "@/redux/features/search/searchSlice";
import { useGetMonitorDeliveryOrdersQuery } from "@/redux/features/monitorDelivery/monitorDeliveryApi";

// import DateRangeSelector from "@/components/DateRangeSelector";

const StatusButtons = ({ manageProcessing }: { manageProcessing: boolean }) => {
  const dispatch = useAppDispatch();

  const { page, limit, isLoading } = useAppSelector(
    ({ pagination }) => pagination
  );

  const { startFrom, endAt } = useAppSelector(({ orders }) => orders);

  const { selectedStatus: filter, monitorDeliveryOrders } = useAppSelector(
    ({ monitorDelivery }) => monitorDelivery
  );

  if (!monitorDeliveryOrders.length && page > 1) {
    dispatch(setPage(1));
  }

  const [orderStatusCount, setOrderStatusCount] = useState([]);

  const {
    data,
    isLoading: loading,
    error,
  } = useGetMonitorDeliveryOrdersQuery({
    deliveryStatus:
      manageProcessing && filter == "in_review" ? "cancelled" : filter,
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
      dispatch(setMonitorDeliveryOrders(orders?.data));
      dispatch(setSearch(false));
      dispatch(setSearchQuery(""));
      dispatch(setSearchedOrders([]));
      dispatch(setIsLoading(false));
    }
    if (error) {
      throw new Error("Something went wrong!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading, error, dispatch]);

  const showStatus = manageProcessing
    ? orderStatusCount?.filter(
        ({ name }) => name == "partial_delivered" || name == "cancelled"
      )
    : orderStatusCount;

  return (
    <div className="flex flex-wrap items-center justify-start gap-5">
      {showStatus?.map((status: { name: string; total: string }) => {
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
            className={`capitalize bg-white flex items-center gap-1 rounded-2xl ${borderColor(status.name)} ${filter === status.name ? bg : ""}`}
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

export default StatusButtons;

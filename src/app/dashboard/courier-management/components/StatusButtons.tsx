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
  setProcessingDoneOrders,
  setSelectedStatus,
} from "@/redux/features/courierManagement/courierManagementSlice";
import borderColor from "@/utilities/borderColor";
import backgroundColor from "@/utilities/backgroundColor";
import {
  setSearch,
  setSearchQuery,
  setSearchedOrders,
} from "@/redux/features/search/searchSlice";
import { useGetProcessingDoneAndCourierOrdersQuery } from "@/redux/features/courierManagement/courierManagementApi";
// import DateRangeSelector from "@/components/DateRangeSelector";

const StatusButtons = () => {
  const dispatch = useAppDispatch();
  const { page, limit, isLoading } = useAppSelector(
    ({ pagination }) => pagination
  );
  const { startFrom, endAt } = useAppSelector(({ orders }) => orders);
  const { selectedStatus: filter, processingDoneOrders } = useAppSelector(
    ({ courierManagement }) => courierManagement
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

  // useEffect(() => {
  //   (async () => {
  //     if (filter) {
  //       dispatch(setIsLoading(true));
  //       const { data, meta } = await fetchData({
  //         endPoint: "/orders/admin/processing-done-on-courier-orders",
  //         tags: ["processingDoneOrders"],
  //         searchParams: {
  //           status: filter,
  //           sort: "-createdAt",
  //           page,
  //           limit,
  //         },
  //       });
  //       dispatch(setTotalPage(meta));
  //       setOrderStatusCount(data.countsByStatus);
  //       dispatch(setProcessingDoneOrders(data.data));
  //       dispatch(setSearch(false));
  //       dispatch(setSearchQuery(""));
  //       dispatch(setSearchedOrders([]));
  //       dispatch(setIsLoading(false));
  //     }
  //   })();
  // }, [filter, page, limit, iSOrderUpdate, dispatch]);

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

"use client";
import { setIsLoading } from "@/redux/features/pagination/PaginationSlice";
import {
  setSearch,
  setSearchedOrders,
} from "@/redux/features/search/searchSlice";
import { useAppDispatch } from "@/redux/hooks";
import fetchData from "@/utilities/fetchData";
import { useEffect } from "react";

const SetOrderHistoryData = ({
  searchQuery,
  userId,
}: {
  searchQuery?: string;
  userId?: string;
}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setIsLoading(true));
    dispatch(setSearch(true));
    const fetchOrders = async () => {
      const searchParams: Record<string, unknown> = {
        sort: "-createdAt",
      };

      if (searchQuery) {
        searchParams.search = searchQuery;
      }

      if (userId) {
        searchParams.userId = userId;
      }

      const { data } = await fetchData({
        endPoint: "/orders/admin/all-orders",
        cache: "no-store",
        searchParams,
      });
      dispatch(setSearchedOrders(data?.data));
      dispatch(setIsLoading(false));
    };
    fetchOrders();
  }, [dispatch, searchQuery, userId]);
  return <></>;
};

export default SetOrderHistoryData;

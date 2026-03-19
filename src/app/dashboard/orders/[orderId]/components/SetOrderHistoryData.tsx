"use client";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { setIsLoading } from "@/redux/features/pagination/PaginationSlice";
import {
  setSearch,
  setSearchedOrders,
} from "@/redux/features/search/searchSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";

const SetOrderHistoryData = ({
  searchQuery,
  userId,
}: {
  searchQuery?: string;
  userId?: string;
}) => {
  const dispatch = useAppDispatch();

  const searchParams: Record<string, unknown> = {
    sort: "-createdAt",
  };

  if (searchQuery) {
    searchParams.search = searchQuery;
  }

  if (userId) {
    searchParams.userId = userId;
  }

  const { data, isLoading, isFetching } = useGetAllOrdersQuery(searchParams);

  useEffect(() => {
    dispatch(setIsLoading(isLoading || isFetching));
    dispatch(setSearch(true));
    if (data?.data) {
      dispatch(setSearchedOrders(data?.data?.data));
    }
  }, [dispatch, data, isLoading, isFetching]);

  return null;
};

export default SetOrderHistoryData;

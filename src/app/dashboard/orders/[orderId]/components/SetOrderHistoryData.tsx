"use client";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import {
  setIsLoading,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import {
  setSearch,
  setSearchedOrders,
} from "@/redux/features/search/searchSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useRef } from "react";

const SetOrderHistoryData = ({
  searchQuery,
  userId,
}: {
  searchQuery?: string;
  userId?: string;
}) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector(({ pagination }) => pagination);
  const queryKey = `${searchQuery || ""}:${userId || ""}`;
  const previousQueryKey = useRef<string | null>(null);
  const shouldResetPage = previousQueryKey.current !== queryKey;
  const activePage = shouldResetPage ? 1 : page;

  useEffect(() => {
    if (previousQueryKey.current !== queryKey) {
      previousQueryKey.current = queryKey;
      if (page !== 1) {
        dispatch(setPage(1));
      }
    }
  }, [dispatch, page, queryKey]);

  const searchParams: Record<string, unknown> = {
    sort: "-createdAt",
    page: activePage,
    limit,
  };

  if (searchQuery) {
    searchParams.search = searchQuery;
  }

  if (userId) {
    searchParams.userId = userId;
  }

  const { data, isLoading, isFetching } = useGetAllOrdersQuery(searchParams, {
    skip: !searchQuery && !userId,
  });

  useEffect(() => {
    dispatch(setIsLoading(isLoading || isFetching));
    dispatch(setSearch(true));
    if (data?.data) {
      dispatch(setSearchedOrders(data?.data?.data || []));
    }
    if (data?.meta) {
      dispatch(setTotalPage(data.meta));
    }
  }, [dispatch, data, isLoading, isFetching]);

  return null;
};

export default SetOrderHistoryData;

"use client";
import { useGetAllCouponsQuery } from "@/redux/features/coupon/couponApi";
import {
  setCouponLoading,
  setCoupons,
} from "@/redux/features/coupon/couponSlice";
import {
  setIsLoading,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";

const FetchCouponData = () => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector(({ pagination }) => pagination);
  const { codes } = useAppSelector(({ allCoupons }) => allCoupons);

  if (!codes?.length && page > 1) {
    dispatch(setPage(1));
  }

  const { selectedType, selectedTags, search } = useAppSelector(
    ({ allCoupons }) => allCoupons
  );

  const { data, isLoading, isSuccess } = useGetAllCouponsQuery({
    type: selectedType,
    ...{ page, limit },
    tags: selectedTags,
    search,
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(setIsLoading(true));
    }

    if (data || isLoading || isSuccess || limit) {
      dispatch(setCoupons(data?.data));
      dispatch(setCouponLoading(isLoading));
      if (data?.meta) {
        dispatch(setTotalPage(data?.meta));
      }
    }

    if (isSuccess) {
      dispatch(setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, data?.data, isLoading, isSuccess, limit]);
  return <></>;
};

export default FetchCouponData;

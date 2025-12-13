"use client";

import { useGetShippingChargeAdminQuery } from "@/redux/features/shippingCharge/shippingCharge";
import {
  setShippingChargeLoading,
  setShippingCharges,
} from "@/redux/features/shippingCharge/ShippingChargeSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";

const FetchShippingCharges = () => {
  const { data, isLoading } = useGetShippingChargeAdminQuery({});
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setShippingCharges(data?.data));
    dispatch(setShippingChargeLoading(isLoading));
  }, [data?.data, dispatch, isLoading]);

  return <></>;
};

export default FetchShippingCharges;

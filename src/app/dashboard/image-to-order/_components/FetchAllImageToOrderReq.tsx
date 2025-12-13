"use client";

import { useGetImageToOrderReqQuery } from "@/redux/features/imageToOrder/imageToOrderApi";
import {
  setImageToOrder,
  setImageToOrderLoading,
} from "@/redux/features/imageToOrder/imageToOrderSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";

const FetchAllImageToOrderReq = () => {
  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetImageToOrderReqQuery({});

  useEffect(() => {
    dispatch(setImageToOrder(data?.data));
    dispatch(setImageToOrderLoading(isLoading));
  }, [data?.data, dispatch, isLoading]);
  return <></>;
};

export default FetchAllImageToOrderReq;

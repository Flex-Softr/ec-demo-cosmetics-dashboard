"use client";
import { useGetWarrantyClaimRequestsQuery } from "@/redux/features/warrantyClaimRequests/warrantyClaimApi";
import { setRequests } from "@/redux/features/warrantyClaimRequests/warrantyClaimSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";

const WarrantyClaimData = () => {
  const { data, isLoading } = useGetWarrantyClaimRequestsQuery({
    sort: "-createdAt",
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setRequests(data?.data));
  }, [data?.data, dispatch, isLoading]);
  return <></>;
};

export default WarrantyClaimData;

"use client";

import {
  setIsLoading,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { useGetRegisteredCustomersQuery } from "@/redux/features/registeredCustomer/RegisteredCustomerApi";
import {
  setRegisteredCustomer,
  setRegisteredCustomerLoading,
} from "@/redux/features/registeredCustomer/RegisteredCustomerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";

const RegisteredCustomerData = () => {
  const dispatch = useAppDispatch();

  const { page, limit } = useAppSelector(({ pagination }) => pagination);

  const { searchTerms, users } = useAppSelector(
    ({ registeredCustomer }) => registeredCustomer
  );

  if (!users?.length && page > 1) {
    dispatch(setPage(1));
  }

  const {
    data: registeredCustomers,
    isLoading,
    isSuccess,
  } = useGetRegisteredCustomersQuery({
    search: searchTerms,
    ...{ page, limit },
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(setIsLoading(true));
    }

    if (registeredCustomers || isLoading || isSuccess || limit) {
      dispatch(setRegisteredCustomer(registeredCustomers?.data));
      dispatch(setRegisteredCustomerLoading(isLoading));
      if (registeredCustomers?.meta) {
        dispatch(setTotalPage(registeredCustomers?.meta));
      }
    }

    if (isSuccess) dispatch(setIsLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isSuccess, limit, registeredCustomers]);

  return <></>;
};

export default RegisteredCustomerData;

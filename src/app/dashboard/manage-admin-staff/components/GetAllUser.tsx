"use client";

import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { setIsUsersLoading, setUsers } from "@/redux/features/user/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";

const GetAllUser = () => {
  const { data, isLoading } = useGetAllUsersQuery({ search: undefined });
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setUsers(data?.data || []));
    dispatch(setIsUsersLoading(isLoading));
  }, [data, isLoading, dispatch]);
  return <></>;
};

export default GetAllUser;

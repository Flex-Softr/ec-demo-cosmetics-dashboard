"use client";

import { useAppSelector } from "@/redux/hooks";
import { TPermissionEnum } from "@/types/order/order.interface";
import isPermitted from "@/utilities/isPermitted";
export const useIsPermitted = (requiredPermission?: TPermissionEnum) => {
  const { profile, isProfileLoading } = useAppSelector(({ auth }) => auth);
  const permitted = isPermitted(profile?.permissions, requiredPermission);
  return { isPermitted: permitted, isProfileLoading };
};

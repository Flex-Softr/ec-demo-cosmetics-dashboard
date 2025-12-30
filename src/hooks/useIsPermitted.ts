"use client";

import { TPermissionName } from "@/const/permissions";
import { useAppSelector } from "@/redux/hooks";
import isPermitted from "@/utilities/isPermitted";
export const useIsPermitted = (requiredPermission?: TPermissionName) => {
  const { profile, isProfileLoading } = useAppSelector(({ auth }) => auth);
  const permitted = isPermitted(profile?.permissions, requiredPermission);
  return { isPermitted: permitted, isProfileLoading };
};

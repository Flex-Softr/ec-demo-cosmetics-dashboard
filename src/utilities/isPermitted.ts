import { PERMISSIONS, TPermissionName } from "@/const/permissions";

export type TPermission = { _id: string; name: string };

const isPermitted = (
  permissions?: TPermission[],
  requiredPermission?: TPermissionName
) => {
  const neededPermission = requiredPermission
    ? requiredPermission
    : PERMISSIONS.SUPER_ADMIN;
  if (permissions?.length) {
    return (
      permissions.some((p) => p.name === PERMISSIONS.SUPER_ADMIN) ||
      permissions.some((p) => p.name === neededPermission)
    );
  }
  return false;
};

export default isPermitted;

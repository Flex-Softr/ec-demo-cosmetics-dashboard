import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";

export async function requireBlogAccess() {
  const { permissions = [] } = await getPermission();
  const canAccess =
    isPermitted(permissions, PERMISSIONS.SUPER_ADMIN) ||
    isPermitted(permissions, PERMISSIONS.MANAGE_BLOG);

  if (!canAccess) {
    redirect("/error");
  }
}

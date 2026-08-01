import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import EditCouponClient from "./EditCouponClient";

const EditCouponPage = async ({ params }: { params: { id: string } }) => {
  const { permissions = [] } = await getPermission();
  const canManage = isPermitted(permissions, PERMISSIONS.MANAGE_COUPON);

  if (!canManage) {
    redirect("/error");
  }

  return <EditCouponClient id={params.id} />;
};

export default EditCouponPage;

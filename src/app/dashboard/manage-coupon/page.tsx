import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import AllCoupons from "./components/allCoupons/AllCoupons";

const ManageCoupons = async () => {
  const { permissions = [] } = await getPermission();

  const manageAdminOrStaff = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_COUPON
  );

  if (!manageAdminOrStaff) {
    redirect("/error");
  }
  return <AllCoupons />;
};

export default ManageCoupons;

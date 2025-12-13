import { getPermission } from "@/lib/getAccessToken";
import { permission } from "@/types/order/order.interface";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import AllCoupons from "./components/allCoupons/AllCoupons";

const ManageCoupons = () => {
  const { permissions = [] } = getPermission();

  const manageAdminOrStaff = isPermitted(permissions, permission.manageCoupon);

  if (!manageAdminOrStaff) {
    redirect("/error");
  }
  return (
    <>
      <AllCoupons />
    </>
  );
};

export default ManageCoupons;

import { getPermission } from "@/lib/getAccessToken";
import { permission } from "@/types/order/order.interface";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import AllShippingCharges from "./_components/allShippingCharge/AllShippingCharges";
import CreateShippingCharge from "./_components/createShippingCharge/CreateShippingCharge";

const ManageShippingCharges = () => {
  const { permissions = [] } = getPermission();

  const manageAdminOrStaff = isPermitted(permissions, permission.manageCoupon);

  if (!manageAdminOrStaff) {
    redirect("/error?s=d");
  }

  return (
    <div className="px-3 pt-3 grid grid-cols-5 gap-5">
      <CreateShippingCharge />
      <AllShippingCharges />
    </div>
  );
};

export default ManageShippingCharges;

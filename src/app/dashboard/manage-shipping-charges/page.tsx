import { getPermission } from "@/lib/getAccessToken";
import { permission } from "@/types/order/order.interface";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import AllShippingCharges from "./_components/allShippingCharge/AllShippingCharges";
import CreateShippingCharge from "./_components/createShippingCharge/CreateShippingCharge";
import { Card } from "@/components/ui/card";

const ManageShippingCharges = async () => {
  const { permissions = [] } = await getPermission();

  const manageAdminOrStaff = isPermitted(permissions, permission.manageCoupon);

  if (!manageAdminOrStaff) {
    redirect("/error?s=d");
  }

  return (
    <Card className="grid grid-cols-5 gap-5 m-4">
      <CreateShippingCharge />
      <AllShippingCharges />
    </Card>
  );
};

export default ManageShippingCharges;

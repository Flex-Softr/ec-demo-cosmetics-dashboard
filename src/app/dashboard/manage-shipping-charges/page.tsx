import PageHeader from "@/components/pageHeader/PageHeader";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { Truck } from "lucide-react";
import { redirect } from "next/navigation";
import AllShippingCharges from "./_components/allShippingCharge/AllShippingCharges";
import CreateShippingCharge from "./_components/createShippingCharge/CreateShippingCharge";

const ManageShippingCharges = async () => {
  const { permissions = [] } = await getPermission();

  const manageAdminOrStaff = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_SHIPPING_CHARGE
  );

  if (!manageAdminOrStaff) {
    redirect("/error?s=d");
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Shipping Charges"
        subtitle="Create and manage delivery charge options"
        icon={Truck}
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
        <CreateShippingCharge />
        <AllShippingCharges />
      </div>
    </div>
  );
};

export default ManageShippingCharges;

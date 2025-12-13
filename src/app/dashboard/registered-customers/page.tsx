import Show from "@/components/Show";
import { Card } from "@/components/ui/card";
import { getPermission } from "@/lib/getAccessToken";
import { permission } from "@/types/order/order.interface";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import RegisteredCustomerData from "./_components/RegisteredCustomerData";
import RegisteredCustomerTable from "./_components/allRegisteredCustomer/RegisteredCustomerTable";
import SearchRegisteredUser from "./_components/allRegisteredCustomer/SearchRegisteredUser";

const page = () => {
  const { permissions = [] } = getPermission();

  const manageAdminOrStaff = isPermitted(
    permissions,
    permission.manageCustomers
  );

  if (!manageAdminOrStaff) {
    redirect("/error");
  }
  return (
    <>
      <RegisteredCustomerData />
      <Card className="p-4 shadow-none rounded-xl m-3">
        <h2 className="text-2xl font-bold">Registered customers</h2>
        <hr className="my-4" />
        <div className="flex justify-end">
          <SearchRegisteredUser />
        </div>
        <div className="flex justify-end mt-5">
          <Show />
        </div>
        <div className="mt-4">
          <RegisteredCustomerTable />
        </div>
      </Card>
    </>
  );
};

export default page;

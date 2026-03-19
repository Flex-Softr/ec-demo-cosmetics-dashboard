import Show from "@/components/Show";
import { Card } from "@/components/ui/card";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import RegisteredCustomerData from "./_components/RegisteredCustomerData";
import RegisteredCustomerTable from "./_components/allRegisteredCustomer/RegisteredCustomerTable";
import SearchRegisteredUser from "./_components/allRegisteredCustomer/SearchRegisteredUser";

const page = async () => {
  const { permissions = [] } = await getPermission();

  const manageAdminOrStaff = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_CUSTOMER
  );

  if (!manageAdminOrStaff) {
    redirect("/error");
  }
  return (
    <>
      <RegisteredCustomerData />
      <Card className="m-2 sm:m-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <h2 className="text-xl md:text-2xl font-bold">
            Registered customers
          </h2>
          <div className="w-full sm:w-auto">
            <SearchRegisteredUser />
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex justify-end mt-5">
          <Show />
        </div>
        <div className="mt-4 overflow-x-auto -mx-4 sm:mx-0">
          <RegisteredCustomerTable />
        </div>
      </Card>
    </>
  );
};

export default page;

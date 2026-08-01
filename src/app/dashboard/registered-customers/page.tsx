import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import Show from "@/components/Show";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { UserRound } from "lucide-react";
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
      <div className="space-y-5 p-4 sm:p-6">
        <PageHeader
          title="Registered Customers"
          subtitle="View and manage registered customer accounts"
          icon={UserRound}
        />
        <ContentCard>
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SearchRegisteredUser />
              <Show />
            </div>
            <RegisteredCustomerTable />
          </div>
        </ContentCard>
      </div>
    </>
  );
};

export default page;

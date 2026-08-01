import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { Users } from "lucide-react";
import { redirect } from "next/navigation";
import CreateUser from "./components/CreateUser/CreateUser";
import GetAllUser from "./components/GetAllUser";
import SearchEmployee from "./components/SearchEmployee/SearchEmployee";
import UsersTable from "./components/UsersTable";

const ManageUser = async () => {
  const { permissions = [] } = await getPermission();

  const manageAdminOrStaff = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_ADMIN_OR_STAFF
  );

  if (!manageAdminOrStaff) {
    redirect("/error");
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <GetAllUser />
      <PageHeader
        title="Manage Employees"
        subtitle="Create and manage admin and staff accounts"
        icon={Users}
        actions={<CreateUser />}
      />
      <ContentCard>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <SearchEmployee />
          </div>
          <UsersTable />
        </div>
      </ContentCard>
    </div>
  );
};

export default ManageUser;

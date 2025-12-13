import { Card } from "@/components/ui/card";
import { getPermission } from "@/lib/getAccessToken";
import { permission } from "@/types/order/order.interface";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import CreateUser from "./components/CreateUser/CreateUser";
import GetAllUser from "./components/GetAllUser";
import SearchEmployee from "./components/SearchEmployee/SearchEmployee";
import UsersTable from "./components/UsersTable";

const ManageUser = () => {
  const { permissions = [] } = getPermission();

  const manageAdminOrStaff = isPermitted(
    permissions,
    permission.manageAdminOrStaff
  );

  if (!manageAdminOrStaff) {
    redirect("/error");
  }

  return (
    <>
      <GetAllUser />
      <Card className="p-4 shadow-none rounded-xl m-3">
        <h2 className="text-2xl font-bold">Manage employs</h2>
        <hr className="mt-4 mb-6" />
        <div className="space-y-3">
          <div className="flex justify-between px-3">
            <CreateUser />
            <SearchEmployee />
          </div>
          <UsersTable />
        </div>
      </Card>
    </>
  );
};

export default ManageUser;

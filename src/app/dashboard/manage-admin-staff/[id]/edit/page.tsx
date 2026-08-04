import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import EditAdminClient from "./EditAdminClient";

const EditAdminPage = async ({ params }: { params: { id: string } }) => {
  const { permissions = [] } = await getPermission();

  const manageAdminOrStaff = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_ADMIN_OR_STAFF
  );

  if (!manageAdminOrStaff) {
    redirect("/error");
  }

  return <EditAdminClient id={params.id} />;
};

export default EditAdminPage;

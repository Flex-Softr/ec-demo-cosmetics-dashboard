import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import AddAttribute from "./components/AddAttributes";
import AddedAttributes from "./components/AddedAttributes";

const Attributes = async () => {
  const { permissions = [] } = await getPermission();

  const manageProduct = isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT);

  if (!manageProduct) {
    redirect("/error");
  }

  return (
    <div className="h-screen text-gray-900">
      <div className="flex justify-between gap-5 px-4 pt-4">
        <div className="flex-1">
          <AddAttribute />
        </div>
        <div className="flex-1">
          <AddedAttributes />
        </div>
      </div>
    </div>
  );
};

export default Attributes;

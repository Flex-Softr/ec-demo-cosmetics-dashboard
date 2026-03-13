import { Card } from "@/components/ui/card";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
// Removed broken AddCategoryForm import
import { CategoryTable } from "./components/CategoryTable";

const AddCategory = async () => {
  const { permissions = [] } = await getPermission();

  const manageProduct = isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT);

  if (!manageProduct) {
    redirect("/error");
  }
  return (
    <Card className="m-4 p-4">
      <div className="w-full">
        <CategoryTable />
      </div>
    </Card>
  );
};

export default AddCategory;

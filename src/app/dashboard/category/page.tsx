import { Card } from "@/components/ui/card";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import AddCategoryForm from "./components/AddCategoryForm";
import { CategoryTable } from "./components/CategoryTable";

const AddCategory = async () => {
  const { permissions = [] } = await getPermission();

  const manageProduct = isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT);

  if (!manageProduct) {
    redirect("/error");
  }
  return (
    <Card className="m-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Set Up</h1>
        <AddCategoryForm />
      </div>
      <hr className="my-4" />
      <div className="w-full">
        <CategoryTable />
      </div>
    </Card>
  );
};

export default AddCategory;

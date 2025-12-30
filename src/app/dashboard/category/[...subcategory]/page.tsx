import { Card } from "@/components/ui/card";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import AddSubCategoryForm from "./components/AddSubCategoryForm";
import { CategoryTable } from "./components/SubCategoryTable";

const SubCategory = async ({
  params,
}: {
  params: { subcategory: string[] };
}) => {
  const categoryName = params?.subcategory[0].replace(/-/g, " ");
  const categoryId = params?.subcategory[1];

  const { permissions = [] } = await getPermission();

  const manageProduct = isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT);

  if (!manageProduct) {
    redirect("/error");
  }

  return (
    <Card className="m-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Sub Categories of <span className="text-primary">{categoryName}</span>
        </h1>
        <AddSubCategoryForm category={categoryId} />
      </div>
      <hr className="my-4" />
      <div className="w-full">
        <CategoryTable categoryId={categoryId} />
      </div>
    </Card>
  );
};

export default SubCategory;

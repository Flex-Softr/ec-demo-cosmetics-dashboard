import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import CategoriesPageContent from "./components/CategoriesPageContent";

const CategoryPage = async () => {
  const { permissions = [] } = await getPermission();

  const manageProduct = isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT);

  if (!manageProduct) {
    redirect("/error");
  }

  return (
    <div className="p-4 sm:p-6 h-full">
      <CategoriesPageContent />
    </div>
  );
};

export default CategoryPage;

import { Card } from "@/components/ui/card";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import SubCategoryContent from "./components/SubCategoryContent";

const SubCategory = async ({ params }: { params: { categoryId: string } }) => {
  const categoryId = params?.categoryId;

  const { permissions = [] } = await getPermission();

  const manageProduct = isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT);

  if (!manageProduct) {
    redirect("/error");
  }

  return (
    <Card className="m-4">
      <SubCategoryContent categoryId={categoryId} />
    </Card>
  );
};

export default SubCategory;

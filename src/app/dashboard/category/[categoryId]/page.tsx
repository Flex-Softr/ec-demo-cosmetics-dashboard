import ContentCard from "@/components/contentCard/ContentCard";
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
    <div className="space-y-5 p-4 sm:p-6">
      <ContentCard>
        <SubCategoryContent categoryId={categoryId} />
      </ContentCard>
    </div>
  );
};

export default SubCategory;

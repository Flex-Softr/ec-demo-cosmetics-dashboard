import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { Plus, Tag } from "lucide-react";
import { redirect } from "next/navigation";
import BrandForm from "./components/BrandForm";
import BrandTable from "./components/BrandsTable";

const Brand = async () => {
  const { permissions = [] } = await getPermission();
  const manageProduct = isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT);

  if (!manageProduct) {
    redirect("/error");
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Brands"
        subtitle="Manage all product brands"
        icon={Tag}
        actions={
          <BrandForm
            trigger={
              <Button size="sm" className="rounded-lg gap-1.5">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Brand</span>
              </Button>
            }
          />
        }
      />
      <ContentCard>
        <BrandTable />
      </ContentCard>
    </div>
  );
};

export default Brand;

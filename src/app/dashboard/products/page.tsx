import Show from "@/components/Show";
import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { Package, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import CountByStatusButtons from "./components/CountByStatusButtons";
import ProductBulkAction from "./components/ProductBulkAction";
import ProductFilter from "./components/ProductFilter";
import ProductSearchBar from "./components/ProductSearchBar";
import ProductsTable from "./components/ProductsTable";

const AllProducts = async () => {
  const { permissions = [] } = await getPermission();

  const manageProduct = isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT);

  if (!manageProduct) {
    redirect("/error");
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Products"
        subtitle="Manage your store products"
        icon={Package}
        actions={
          <Button asChild size="sm" className="rounded-lg gap-1.5">
            <Link href="/dashboard/add-products">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Product</span>
            </Link>
          </Button>
        }
      />

      <ContentCard>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CountByStatusButtons />
            <ProductSearchBar endPoint="/products/admin" />
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between">
            <ProductBulkAction />
            <div className="flex flex-wrap items-center gap-2">
              <ProductFilter />
              <Show />
            </div>
          </div>

          <ProductsTable />
        </div>
      </ContentCard>
    </div>
  );
};

export default AllProducts;

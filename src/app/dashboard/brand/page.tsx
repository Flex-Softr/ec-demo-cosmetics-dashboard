import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import AddBrandForm from "./components/AddBrandForm";
import { BrandTable } from "./components/BrandsTable";

const Brand = async () => {
  const { permissions = [] } = await getPermission();

  const manageProduct = isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT);

  if (!manageProduct) {
    redirect("/error");
  }
  return (
    <div className="flex gap-4 justify-between items-start h-screen px-4 pt-4">
      <Card className="space-y-5 flex-1">
        <h2 className="text-xl font-bold"> Add New Brand</h2>
        <AddBrandForm />
      </Card>
      <Card className="space-y-5 flex-1 h-full">
        <h2 className="text-xl font-bold"> All Brands</h2>
        <div>
          <BrandTable />
          <Pagination />
        </div>
      </Card>
    </div>
  );
};

export default Brand;

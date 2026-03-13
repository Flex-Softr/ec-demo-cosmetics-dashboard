import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
        <BrandForm
          trigger={
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          }
        />
      </div>

      <BrandTable />
    </div>
  );
};

export default Brand;

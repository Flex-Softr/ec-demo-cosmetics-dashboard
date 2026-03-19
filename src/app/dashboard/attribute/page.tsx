import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import AttributeTable from "./components/AttributeTable";
import AttributeForm from "./components/AttributeForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Attributes = async () => {
  const { permissions = [] } = await getPermission();

  const manageProduct = isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT);

  if (!manageProduct) {
    redirect("/error");
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 text-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Attributes
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Manage your product attributes and their values globally.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <AttributeForm
            trigger={
              <Button className="flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add Attribute
              </Button>
            }
          />
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <AttributeTable />
      </div>
    </div>
  );
};

export default Attributes;

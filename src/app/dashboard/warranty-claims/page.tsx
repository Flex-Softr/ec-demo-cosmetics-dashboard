import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import config from "@/config/config";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import Link from "next/link";
import { redirect } from "next/navigation";
import WarrantyClaimData from "./components/WarrantyClaimData";
import WarrantyClaimTable from "./components/WarrantyClaimTable";

const AllClaimRequestPage = async () => {
  const { permissions = [] } = await getPermission();

  const manageWarrantyClaim = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_WARRANTY_CLAIM
  );

  if (!manageWarrantyClaim) {
    redirect("/error");
  }

  return (
    <>
      <WarrantyClaimData />
      <Card className="m-4">
        <h2 className="text-2xl font-bold">Warranty Claims</h2>
        <hr className="my-4" />
        <div className="flex justify-end">
          <Button>
            <Link
              target="_blank"
              href={`${config.base_client_url}/warranty/find-your-product`}
            >
              Create
            </Link>
          </Button>
        </div>
        <div className="mt-4">
          <WarrantyClaimTable />
        </div>
      </Card>
    </>
  );
};

export default AllClaimRequestPage;

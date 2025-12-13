import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import config from "@/config/config";
import { getPermission } from "@/lib/getAccessToken";
import { permission } from "@/types/order/order.interface";
import isPermitted from "@/utilities/isPermitted";
import Link from "next/link";
import { redirect } from "next/navigation";
import WarrantyClaimData from "./components/WarrantyClaimData";
import WarrantyClaimTable from "./components/WarrantyClaimTable";

const AllClaimRequestPage = () => {
  const { permissions = [] } = getPermission();

  const manageWarrantyClaim = isPermitted(
    permissions,
    permission.manageWarrantyClaim
  );

  if (!manageWarrantyClaim) {
    redirect("/error");
  }

  return (
    <>
      <WarrantyClaimData />
      <Card className="p-4 shadow-none rounded-xl m-3">
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

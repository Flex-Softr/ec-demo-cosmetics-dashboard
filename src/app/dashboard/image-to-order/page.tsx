import { Card } from "@/components/ui/card";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import FetchAllImageToOrderReq from "./_components/FetchAllImageToOrderReq";
import ImgToOrderTable from "./_components/ImgToOrderTable/ImgToOrder";

const AllImageToOrderPage = async () => {
  const { permissions = [] } = await getPermission();

  const manageOrder = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_IMAGE_TO_ORDER
  );

  if (!manageOrder) {
    redirect("/error");
  }

  return (
    <>
      <FetchAllImageToOrderReq />
      <Card className="m-4">
        <h2 className="text-2xl font-bold mb-2">Orders requests</h2>
        <hr className="mb-8" />
        <ImgToOrderTable />
      </Card>
    </>
  );
};

export default AllImageToOrderPage;

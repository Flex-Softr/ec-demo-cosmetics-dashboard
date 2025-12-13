import { Card } from "@/components/ui/card";
import { getPermission } from "@/lib/getAccessToken";
import { permission } from "@/types/order/order.interface";
import { redirect } from "next/navigation";
import FetchAllImageToOrderReq from "./_components/FetchAllImageToOrderReq";
import ImgToOrderTable from "./_components/ImgToOrderTable/ImgToOrder";

const AllImageToOrderPage = () => {
  const { permissions = [] } = getPermission();

  const manageOrder =
    permissions &&
    (permissions.includes(permission.superAdmin) ||
      permissions.includes(permission.manageOrder));

  if (!manageOrder) {
    redirect("/error");
  }

  return (
    <>
      <FetchAllImageToOrderReq />
      <Card className="p-4 shadow-none rounded-xl m-3">
        <h2 className="text-2xl font-bold mb-2">Orders requests</h2>
        <hr className="mb-8" />
        <div></div>
        <ImgToOrderTable />
      </Card>
    </>
  );
};

export default AllImageToOrderPage;

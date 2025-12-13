import OrderSearchBar from "@/components/OrderSearchBar";
import Show from "@/components/Show";
import { Card } from "@/components/ui/card";
import { getPermission } from "@/lib/getAccessToken";
import { permission } from "@/types/order/order.interface";
import { redirect } from "next/navigation";
import BulkAction from "./components/BulkAction";
import ProcessingOrderDateRange from "./components/ProcessingOrderDateRange";
import ProcessingOrdersStatusButtons from "./components/processingOrdersStatusButtons";
import ProcessingOrdersTable from "./components/ProcessingOrdersTable";

const Orders = () => {
  const { permissions = [] } = getPermission();

  const manageProcessing =
    permissions &&
    (permissions.includes(permission.superAdmin) ||
      permissions.includes(permission.manageProcessing));

  if (!manageProcessing) {
    redirect("/error");
  }

  return (
    <Card className="bg-white px-4 pt-4 rounded-md m-4">
      {/* header section , search bar  */}
      <div className="grid grid-cols-2 justify-between items-center">
        <h1 className="text-2xl font-bold">Processing orders</h1>
        <OrderSearchBar endPoint="/orders/admin/processing-orders" />
      </div>
      <hr className="my-4" />
      <div className="space-y-3">
        {/* All, processing, processing done, canceled etc status*/}
        <ProcessingOrdersStatusButtons />
        <div className="flex items-center justify-between gap-5 overflow-x-auto pt-4 px-1 pb-1">
          {/*Bulk actions and invoice print for Orders*/}
          <BulkAction />
          <ProcessingOrderDateRange />
          <Show />
        </div>
        {/* Processing orders table */}
        <ProcessingOrdersTable />
      </div>
    </Card>
  );
};

export default Orders;

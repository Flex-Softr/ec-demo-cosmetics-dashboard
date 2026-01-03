import OrderSearchBar from "@/components/OrderSearchBar";
import Show from "@/components/Show";
import { Card } from "@/components/ui/card";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import BulkAction from "./components/ProcessingBulkAction";
import ProcessingOrderDateRange from "./components/ProcessingOrderDateRange";
import ProcessingOrdersStatusButtons from "./components/processingOrdersStatusButtons";
import ProcessingOrdersTable from "./components/ProcessingOrdersTable";

const ProcessingOrders = async () => {
  const { permissions = [] } = await getPermission();

  const manageProcessingOrder = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_PROCESSING_ORDER
  );

  if (!manageProcessingOrder) {
    redirect("/error");
  }

  return (
    <Card className="m-4">
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
        <ProcessingOrdersTable permissions={permissions} />
      </div>
    </Card>
  );
};

export default ProcessingOrders;

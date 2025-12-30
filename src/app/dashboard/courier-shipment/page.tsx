import OrderSearchBar from "@/components/OrderSearchBar";
import Show from "@/components/Show";
import { Card } from "@/components/ui/card";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import CourierBulkAction from "./components/CourierBulkAction";
import ProcessingOrderDateRange from "./components/CourierDateRange";
import OrdersTable from "./components/OrdersTable";
import StatusButtons from "./components/StatusButtons";

const CourierShipmentOrder = async () => {
  const { permissions = [] } = await getPermission();

  const manageShipmentOrder = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_SHIPMENT_ORDER
  );

  if (!manageShipmentOrder) {
    redirect("/error");
  }

  return (
    <Card className="m-4">
      {/* header section , button , search bar  */}
      <div className="grid grid-cols-2 justify-between items-center">
        <h1 className="text-2xl font-bold">Shipment Order</h1>
        <OrderSearchBar endPoint="/orders/admin/processing-done-on-courier-orders" />
      </div>
      <hr className="my-4" />
      <div className="space-y-3">
        {/* All, Processing done, on courier etc status*/}
        <StatusButtons />
        <div className="flex items-center justify-between gap-5 overflow-x-auto pt-4 px-1 pb-1">
          {/*Bulk actions and invoice print for Orders*/}
          <CourierBulkAction />
          <ProcessingOrderDateRange />
          <Show />
        </div>
        {/* Courier orders table */}
        <OrdersTable permissions={permissions} />
      </div>
    </Card>
  );
};

export default CourierShipmentOrder;

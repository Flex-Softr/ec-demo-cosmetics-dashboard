import OrderSearchBar from "@/components/OrderSearchBar";
import Show from "@/components/Show";
import { Card } from "@/components/ui/card";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import CourierBulkAction from "./components/CourierBulkAction";
import ProcessingOrderDateRange from "./components/CourierDateRange";
import CourierOrdersTable from "./components/CourierOrdersTable";
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
    <Card className="m-4 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 justify-between items-center">
        <h1 className="text-2xl font-bold">Courier Shipment Order</h1>
        <OrderSearchBar endPoint="/orders/admin/monitor-delivery-orders" />
      </div>

      <hr className="my-4" />
      <div className="space-y-3">
        <StatusButtons />
        <div className="flex items-center justify-between gap-5 overflow-x-auto pt-4 px-1 pb-1">
          <div className="flex items-center gap-2">
            <CourierBulkAction />
          </div>
          <Show />
          <ProcessingOrderDateRange />
        </div>
        <CourierOrdersTable permissions={permissions} />
      </div>
    </Card>
  );
};

export default CourierShipmentOrder;

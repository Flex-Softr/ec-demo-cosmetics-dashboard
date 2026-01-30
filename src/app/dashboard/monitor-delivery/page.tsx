import OrderSearchBar from "@/components/OrderSearchBar";
import Show from "@/components/Show";
import { Card } from "@/components/ui/card";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import MonitorOrderDateRange from "./components/MonitorDateRange";
import OrdersTable from "./components/OrdersTable";
import RefreshCourier from "./components/RefreshCourier";
// import StatusButtons from "./components/StatusButtons";

const MonitorDelivery = async () => {
  const { permissions = [] } = await getPermission();

  const manageShipmentOrder = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_SHIPMENT_ORDER
  );

  const manageProcessingOrder = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_PROCESSING_ORDER
  );

  if (!manageShipmentOrder && !manageProcessingOrder) {
    redirect("/error");
  }

  return (
    <Card className="m-4">
      {/* header section , button , search bar  */}
      <div className="grid grid-cols-2 justify-between items-center">
        <h1 className="text-2xl font-bold">Monitor Delivery</h1>
        <OrderSearchBar endPoint="/orders/admin/order-deliver-status" />
      </div>
      <hr className="my-4" />
      <div className="space-y-3">
        {/* All, Pending, canceled, on courier etc status*/}
        {/* <StatusButtons
          manageProcessing={manageShipmentOrder ? false : manageProcessingOrder}
        /> */}
        <div className="flex items-center justify-between gap-5 overflow-x-auto pt-4 px-1 pb-1">
          {/*Bulk actions for Orders*/}
          <MonitorOrderDateRange />
          <RefreshCourier />
          <Show />
        </div>
        {/*Monitor delivery orders table */}
        <OrdersTable
          editPermission={manageProcessingOrder}
          permissions={permissions}
        />
      </div>
    </Card>
  );
};

export default MonitorDelivery;

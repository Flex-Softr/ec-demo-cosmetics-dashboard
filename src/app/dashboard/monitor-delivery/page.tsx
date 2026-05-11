import OrderSearchBar from "@/components/OrderSearchBar";
import Show from "@/components/Show";
import { Card } from "@/components/ui/card";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import MonitorOrdersTable from "./components/MonitorOrdersTable";
import StatusButtons from "./components/StatusButtons";
import CourierFilter from "./components/CourierFilter";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 justify-between items-center">
        <h1 className="text-2xl font-bold">Monitor Delivery</h1>
        <OrderSearchBar endPoint="/orders/admin/monitor-delivery-orders" />
      </div>
      <hr className="my-4" />
      <div className="space-y-3">
        {/* All, delivery status*/}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusButtons
            manageProcessing={
              manageShipmentOrder ? false : manageProcessingOrder
            }
          />
          <CourierFilter />
        </div>
        <div className="flex items-center justify-between gap-5 overflow-x-auto pt-4 px-1 pb-1">
          <Show />
        </div>
        {/*Monitor delivery orders table */}
        <MonitorOrdersTable
          editPermission={manageProcessingOrder}
          permissions={permissions}
        />
      </div>
    </Card>
  );
};

export default MonitorDelivery;

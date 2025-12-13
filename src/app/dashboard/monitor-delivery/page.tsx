import { Card } from "@/components/ui/card";
import { getPermission } from "@/lib/getAccessToken";
import { permission } from "@/types/order/order.interface";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import OrderSearchBar from "@/components/OrderSearchBar";
import Show from "@/components/Show";
import MonitorOrderDateRange from "./components/MonitorDateRange";
import OrdersTable from "./components/OrdersTable";
import StatusButtons from "./components/StatusButtons";
import RefreshCourier from "./components/RefreshCourier";

const MonitorDelivery = () => {
  const { permissions = [] } = getPermission();

  const manageCourier = isPermitted(permissions, permission.manageCourier);

  const manageProcessing = permissions.includes(permission.manageProcessing);

  const editPermission = isPermitted(permissions, permission.manageProcessing);

  if (!manageCourier && !manageProcessing) {
    redirect("/error");
  }

  return (
    <Card className="bg-white px-4 pt-4 rounded-md m-4">
      {/* header section , button , search bar  */}
      <div className="grid grid-cols-2 justify-between items-center">
        <h1 className="text-2xl font-bold">Monitor Delivery</h1>
        <OrderSearchBar endPoint="/orders/admin/order-deliver-status" />
      </div>
      <hr className="my-4" />
      <div className="space-y-3">
        {/* All, Pending, canceled, on courier etc status*/}
        <StatusButtons
          manageProcessing={manageCourier ? false : manageProcessing}
        />
        <div className="flex items-center justify-between gap-5 overflow-x-auto pt-4 px-1 pb-1">
          {/*Bulk actions for Orders*/}
          <MonitorOrderDateRange />
          <RefreshCourier />
          <Show />
        </div>
        {/*Monitor delivery orders table */}
        <OrdersTable editPermission={editPermission} />
      </div>
    </Card>
  );
};

export default MonitorDelivery;

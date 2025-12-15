import OrderSearchBar from "@/components/OrderSearchBar";
import Show from "@/components/Show";
import { Card } from "@/components/ui/card";
import { getPermission } from "@/lib/getAccessToken";
import { permission } from "@/types/order/order.interface";
import { redirect } from "next/navigation";
import BulkAction from "./components/BulkAction";
import CreateOrder from "./components/CreateOrder";
import OrderDateRange from "./components/OrderDateRange";
import OrdersTable from "./components/OrderHistoryTable";
import OrdersStatusButtons from "./components/OrdersStatusButtons";
const Orders = async () => {
  const { permissions = [] } = await getPermission();

  const manageOrder =
    permissions &&
    (permissions.includes(permission.superAdmin) ||
      permissions.includes(permission.manageOrder));

  if (!manageOrder) {
    redirect("/error");
  }

  return (
    <Card className="m-4">
      {/* header section, search bar  */}
      <div className="grid grid-cols-2 justify-between items-center">
        <h1 className="text-2xl font-bold">All Orders</h1>
        <OrderSearchBar endPoint="/orders/admin/all-orders" />
      </div>
      <hr className="my-4" />
      <div className="space-y-3">
        {/* All, Pending, confirm, canceled etc status*/}
        <OrdersStatusButtons />
        <div className="flex items-center justify-between gap-5 overflow-x-auto pt-4 px-1 pb-1">
          {/*Bulk actions and invoice print for Orders*/}
          <BulkAction />
          <div>
            <CreateOrder text="Create Order" className="rounded-2xl" />
          </div>
          <OrderDateRange />
          <Show />
        </div>
        {/*All orders table */}
        <OrdersTable />
      </div>
    </Card>
  );
};

export default Orders;

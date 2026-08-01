import ContentCard from "@/components/contentCard/ContentCard";
import OrderSearchBar from "@/components/OrderSearchBar";
import PageHeader from "@/components/pageHeader/PageHeader";
import Show from "@/components/Show";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { ShoppingCart } from "lucide-react";
import { redirect } from "next/navigation";
import AllOrdersTable from "./components/AllOrdersTable";
import CreateOrder from "./components/CreateOrder";
import BulkAction from "./components/OrderBulkAction";
import OrderDateRange from "./components/OrderDateRange";
import OrdersStatusButtons from "./components/OrdersStatusButtons";

const Orders = async () => {
  const { permissions = [] } = await getPermission();

  const manageOrder = isPermitted(permissions, PERMISSIONS.MANAGE_ORDER);

  if (!manageOrder) {
    redirect("/error");
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Orders"
        subtitle="Manage and track customer orders"
        icon={ShoppingCart}
        actions={
          <CreateOrder
            text="New Order"
            className="rounded-lg gap-1.5 h-9"
            iconClassName="h-4 w-4"
          />
        }
      />

      <ContentCard>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <OrdersStatusButtons />
            <OrderSearchBar endPoint="/orders/admin/all-orders" />
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between">
            <BulkAction />
            <div className="flex flex-wrap items-center gap-2">
              <OrderDateRange />
              <Show />
            </div>
          </div>

          <AllOrdersTable permissions={permissions} />
        </div>
      </ContentCard>
    </div>
  );
};

export default Orders;

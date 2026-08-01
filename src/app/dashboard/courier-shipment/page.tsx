import ContentCard from "@/components/contentCard/ContentCard";
import OrderSearchBar from "@/components/OrderSearchBar";
import PageHeader from "@/components/pageHeader/PageHeader";
import Show from "@/components/Show";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { Truck } from "lucide-react";
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
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Courier Shipment"
        subtitle="Schedule and manage courier shipments"
        icon={Truck}
      />

      <ContentCard>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <StatusButtons />
            <OrderSearchBar endPoint="/orders/admin/monitor-delivery-orders" />
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between">
            <CourierBulkAction />
            <div className="flex flex-wrap items-center gap-2">
              <ProcessingOrderDateRange />
              <Show />
            </div>
          </div>

          <CourierOrdersTable permissions={permissions} />
        </div>
      </ContentCard>
    </div>
  );
};

export default CourierShipmentOrder;

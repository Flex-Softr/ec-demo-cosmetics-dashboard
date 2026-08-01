import ContentCard from "@/components/contentCard/ContentCard";
import OrderSearchBar from "@/components/OrderSearchBar";
import PageHeader from "@/components/pageHeader/PageHeader";
import Show from "@/components/Show";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { MapPinned } from "lucide-react";
import { redirect } from "next/navigation";
import CourierFilter from "./components/CourierFilter";
import MonitorOrdersTable from "./components/MonitorOrdersTable";
import StatusButtons from "./components/StatusButtons";

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
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Monitor Delivery"
        subtitle="Track delivery status and courier updates"
        icon={MapPinned}
      />

      <ContentCard>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <StatusButtons
                manageProcessing={
                  manageShipmentOrder ? false : manageProcessingOrder
                }
              />
              <CourierFilter />
            </div>
            <OrderSearchBar endPoint="/orders/admin/monitor-delivery-orders" />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Show />
          </div>

          <MonitorOrdersTable
            editPermission={manageProcessingOrder}
            permissions={permissions}
          />
        </div>
      </ContentCard>
    </div>
  );
};

export default MonitorDelivery;

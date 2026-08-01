import ContentCard from "@/components/contentCard/ContentCard";
import OrderSearchBar from "@/components/OrderSearchBar";
import PageHeader from "@/components/pageHeader/PageHeader";
import Show from "@/components/Show";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { PackageCheck } from "lucide-react";
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
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Processing Orders"
        subtitle="Prepare and process confirmed orders"
        icon={PackageCheck}
      />

      <ContentCard>
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <ProcessingOrdersStatusButtons />
            <OrderSearchBar endPoint="/orders/admin/processing-orders" />
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between">
            <BulkAction />
            <div className="flex flex-wrap items-center gap-2">
              <ProcessingOrderDateRange />
              <Show />
            </div>
          </div>

          <ProcessingOrdersTable permissions={permissions} />
        </div>
      </ContentCard>
    </div>
  );
};

export default ProcessingOrders;

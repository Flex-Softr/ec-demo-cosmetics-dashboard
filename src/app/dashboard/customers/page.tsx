import ContentCard from "@/components/contentCard/ContentCard";
import OrderSearchBar from "@/components/OrderSearchBar";
import PageHeader from "@/components/pageHeader/PageHeader";
import Show from "@/components/Show";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { Users } from "lucide-react";
import { redirect } from "next/navigation";
import CustomerFilterClear from "./components/CustomerFilterClear";
import CustomerListOrderDateRange from "./components/CustomerListOrderDateRange";
import CustomerListOrdersStatusButtons from "./components/CustomerListOrdersStatusButtons";
import CustomerOrdersTable from "./components/CustomerOrdersTable";
import FilterByDivisionDistrict from "./components/FilterByDivisionDistrict";
import FilterByProduct from "./components/FilterByProduct";
import FilterBySource from "./components/FilterBySource";
import FilterByTimes from "./components/FilterByTimes";

const Orders = async () => {
  const { permissions = [] } = await getPermission();

  const manageAdminOrStaff = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_CUSTOMER
  );

  if (!manageAdminOrStaff) {
    redirect("/error");
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Customer List"
        subtitle="Browse and filter customer orders"
        icon={Users}
        actions={
          <div className="w-full sm:w-auto">
            <OrderSearchBar endPoint="/orders/admin/processing-orders" />
          </div>
        }
      />
      <ContentCard>
        <div className="space-y-4">
          <CustomerListOrdersStatusButtons />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <CustomerListOrderDateRange />
              <FilterByProduct />
              <FilterBySource />
              <FilterByTimes />
              <FilterByDivisionDistrict />
              <CustomerFilterClear />
            </div>
            <Show />
          </div>
          <CustomerOrdersTable permissions={permissions} />
        </div>
      </ContentCard>
    </div>
  );
};

export default Orders;

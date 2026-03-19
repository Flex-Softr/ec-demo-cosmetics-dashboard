import OrderSearchBar from "@/components/OrderSearchBar";
import Show from "@/components/Show";
import { Card } from "@/components/ui/card";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
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
    <Card className="m-4">
      {/* header section , search bar  */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Customer List</h1>
        <div className="w-full sm:w-auto">
          <OrderSearchBar endPoint="/orders/admin/processing-orders" />
        </div>
      </div>
      <hr className="my-4" />
      <div className="space-y-3">
        {/* All, processing, processing done, canceled etc status*/}
        <CustomerListOrdersStatusButtons />
        <div className="flex flex-wrap items-center justify-between gap-5 overflow-x-auto pt-4 px-1 pb-1">
          <CustomerListOrderDateRange />
          <FilterByProduct />
          <FilterBySource />
          <FilterByTimes />
          <FilterByDivisionDistrict />
          <CustomerFilterClear />
          <Show />
        </div>
        {/* Processing orders table */}
        <CustomerOrdersTable permissions={permissions} />
      </div>
    </Card>
  );
};

export default Orders;

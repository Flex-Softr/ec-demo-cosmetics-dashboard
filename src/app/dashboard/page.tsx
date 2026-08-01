import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import DashboardSummary from "./components/DashboardSummary";
import OrderReport from "./components/OrderReport";
import OrderStatus from "./components/OrderStatus";
import RecentOrders from "./components/RecentOrders";
import SalesSummary from "./components/SalesSummary";
import ShippingStatus from "./components/ShippingStatus";
import TopCustomers from "./components/TopCustomers";

const Dashboard = async () => {
  const { permissions = [] } = await getPermission();
  const isSuperAdmin = isPermitted(permissions, PERMISSIONS.SUPER_ADMIN);

  if (!isSuperAdmin) {
    redirect("/error");
  }

  return (
    <div className="p-2 sm:p-4 space-y-5">
      <DashboardSummary />
      <SalesSummary />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <OrderStatus />
        <ShippingStatus />
      </div>
      <OrderReport />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TopCustomers />
        <RecentOrders />
      </div>
    </div>
  );
};

export default Dashboard;

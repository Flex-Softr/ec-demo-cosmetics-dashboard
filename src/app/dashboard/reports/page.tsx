import PageTitle from "@/components/pageTitle/PageTitle";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import SalesReport from "./components/SalesReport/SalesReport";

const Reports = async () => {
  const { permissions = [] } = await getPermission();
  const isSuperAdmin = isPermitted(permissions, PERMISSIONS.SUPER_ADMIN);

  if (!isSuperAdmin) {
    redirect("/error");
  }

  return (
    <div className="p-2 sm:p-4 space-y-6">
      <PageTitle
        title="Reports"
        subtitle="Advanced sales analytics with date filtering"
      />
      <SalesReport />
    </div>
  );
};

export default Reports;

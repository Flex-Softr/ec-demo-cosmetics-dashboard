import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { BadgePercent, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import AllCoupons from "./components/allCoupons/AllCoupons";

const ManageCoupons = async () => {
  const { permissions = [] } = await getPermission();

  const manageAdminOrStaff = isPermitted(
    permissions,
    PERMISSIONS.MANAGE_COUPON
  );

  if (!manageAdminOrStaff) {
    redirect("/error");
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Coupons"
        subtitle="Manage discount coupons and promotions"
        icon={BadgePercent}
        actions={
          <Button asChild size="sm" className="rounded-lg gap-1.5">
            <Link href="/dashboard/manage-coupon/create">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Coupon</span>
            </Link>
          </Button>
        }
      />
      <ContentCard>
        <AllCoupons />
      </ContentCard>
    </div>
  );
};

export default ManageCoupons;

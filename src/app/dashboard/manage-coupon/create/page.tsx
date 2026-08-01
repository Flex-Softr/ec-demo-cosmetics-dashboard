import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { ArrowLeft, BadgePercent } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import CouponForm from "../components/CouponForm";

const CreateCouponPage = async () => {
  const { permissions = [] } = await getPermission();
  const canManage = isPermitted(permissions, PERMISSIONS.MANAGE_COUPON);

  if (!canManage) {
    redirect("/error");
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Create Coupon"
        subtitle="Add a new discount coupon"
        icon={BadgePercent}
        actions={
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5"
          >
            <Link href="/dashboard/manage-coupon">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </Button>
        }
      />
      <ContentCard>
        <CouponForm />
      </ContentCard>
    </div>
  );
};

export default CreateCouponPage;

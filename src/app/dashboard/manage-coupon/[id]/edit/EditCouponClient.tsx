"use client";

import ContentCard from "@/components/contentCard/ContentCard";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { useGetCouponByIdQuery } from "@/redux/features/coupon/couponApi";
import { TCoupon } from "@/redux/features/coupon/couponInterface";
import { useAppSelector } from "@/redux/hooks";
import { ArrowLeft, BadgePercent } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import CouponForm from "../../components/CouponForm";

const EditCouponClient = ({ id }: { id: string }) => {
  const { codes } = useAppSelector(({ allCoupons }) => allCoupons);
  const cachedCoupon = useMemo(
    () => codes.find((item) => item._id === id),
    [codes, id]
  );

  const { data, isLoading, isError } = useGetCouponByIdQuery(id, {
    skip: Boolean(cachedCoupon),
  });

  const coupon = (cachedCoupon || data?.data?.data || data?.data || data) as
    TCoupon | undefined;

  if (isLoading && !cachedCoupon) {
    return (
      <div className="space-y-5 p-4 sm:p-6">
        <PageHeader
          title="Edit Coupon"
          subtitle="Update coupon details"
          icon={BadgePercent}
        />
        <ContentCard>
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Loading coupon…
          </div>
        </ContentCard>
      </div>
    );
  }

  if ((!coupon || isError) && !cachedCoupon) {
    return (
      <div className="space-y-5 p-4 sm:p-6">
        <PageHeader
          title="Edit Coupon"
          subtitle="Update coupon details"
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
                Back
              </Link>
            </Button>
          }
        />
        <ContentCard>
          <div className="flex h-40 flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
            <p>Coupon not found.</p>
            <Button asChild size="sm" className="rounded-lg">
              <Link href="/dashboard/manage-coupon">Back to coupons</Link>
            </Button>
          </div>
        </ContentCard>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <PageHeader
        title="Edit Coupon"
        subtitle={`Update “${coupon?.name || coupon?.code || "coupon"}”`}
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
        <CouponForm initialData={coupon} />
      </ContentCard>
    </div>
  );
};

export default EditCouponClient;

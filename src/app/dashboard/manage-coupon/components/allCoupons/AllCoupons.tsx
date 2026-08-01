"use client";

import Show from "@/components/Show";
import CouponsClaimTable from "./CouponTable";
import FetchCouponData from "./FetchCouponData";
import FilterByTag from "./FilterByTag";
import SearchCoupon from "./SearchCoupon";

const AllCoupons = () => {
  return (
    <>
      <FetchCouponData />
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <SearchCoupon />
          <div className="flex flex-wrap items-center gap-2">
            <FilterByTag />
            <Show />
          </div>
        </div>
        <CouponsClaimTable />
      </div>
    </>
  );
};

export default AllCoupons;

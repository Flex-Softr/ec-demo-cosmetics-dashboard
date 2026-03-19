"use client";

import Show from "@/components/Show";
import { Card } from "@/components/ui/card";
import CreateCoupons from "../createCoupons/CreateCoupons";
import CouponsClaimTable from "./CouponTable";
import FetchCouponData from "./FetchCouponData";
import FilterByTag from "./FilterByTag";
import SearchCoupon from "./SearchCoupon";

const AllCoupons = () => {
  return (
    <>
      <FetchCouponData />
      <Card className="space-y-5 m-2 sm:m-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <h2 className="text-xl font-bold">All coupons</h2>
          <div className="w-full sm:w-auto">
            <SearchCoupon />
          </div>
        </div>
        <hr className="mt-4" />
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <CreateCoupons />
          <div className="flex flex-wrap gap-3 sm:gap-5">
            <FilterByTag />
            <Show />
          </div>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <CouponsClaimTable />
        </div>
      </Card>
    </>
  );
};

export default AllCoupons;

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
      <div>
        <Card className="p-4 shadow-none rounded-xl space-y-5 m-2">
          <h2 className="text-xl font-bold">All coupons</h2>
          <hr className="!mt-2" />
          <div className="flex justify-end">
            <SearchCoupon />
          </div>
          <div className="flex justify-between">
            <CreateCoupons />
            <div className="flex gap-5">
              <FilterByTag />
              <Show />
            </div>
          </div>
          <CouponsClaimTable />
        </Card>
      </div>
    </>
  );
};

export default AllCoupons;

"use client";

import { Card } from "@/components/ui/card";
import { useGetBestSellingProductsQuery } from "@/redux/features/reports/reportsApi";
import { TBestSellingProduct } from "@/types/reports/period";
import { TSuccessResponse } from "@/types/response/response";
import BestSellingProductsTable from "./BestSellingProductsTable";
const BestSellingProducts = () => {
  const { data, isLoading } = useGetBestSellingProductsQuery({});
  const bestSellingProductData =
    (data as TSuccessResponse<TBestSellingProduct[]>)?.data || [];

  return (
    <>
      <div>
        <Card className="p-4 shadow-none rounded-xl space-y-5">
          <h2 className="text-xl font-bold">Best selling products</h2>
          <hr className="!mt-2" />
          <div className="h-[6px]"></div>
          <BestSellingProductsTable
            bestSellingProductData={bestSellingProductData}
            isLoading={isLoading}
          />
        </Card>
      </div>
    </>
  );
};

export default BestSellingProducts;

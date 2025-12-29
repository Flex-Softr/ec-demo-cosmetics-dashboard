"use client";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useGetAProductQuery } from "@/redux/features/allProducts/allProductsApi";
import React from "react";

type EditProductWrapperProps = {
  productId: string;
  children: React.ReactNode;
};

const EditProductWrapper = ({
  productId,
  children,
}: EditProductWrapperProps) => {
  const { isLoading } = useGetAProductQuery(productId);

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <TableSkeleton />
            <div className="h-64 bg-gray-100 animate-pulse rounded" />
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-gray-100 animate-pulse rounded" />
            <div className="h-48 bg-gray-100 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default EditProductWrapper;

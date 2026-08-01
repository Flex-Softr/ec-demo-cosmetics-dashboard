"use client";

import { useGetAProductQuery } from "@/redux/features/products/productsApi";
import { TProduct } from "@/redux/features/products/productsInterface";

type EditProductWrapperProps = {
  productId: string;
  children: React.ReactNode;
};

const EditProductWrapper = ({
  productId,
  children,
}: EditProductWrapperProps) => {
  const { isLoading } = useGetAProductQuery(productId) as {
    data: TProduct | null;
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <div className="space-y-5 p-4 sm:p-6">
        <div className="flex h-12 items-center justify-between rounded-xl border border-border bg-card px-4">
          <div className="h-5 w-40 animate-pulse rounded-md bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="h-40 animate-pulse rounded-xl border border-border bg-muted/40" />
            <div className="h-64 animate-pulse rounded-xl border border-border bg-muted/40" />
            <div className="h-48 animate-pulse rounded-xl border border-border bg-muted/40" />
          </div>
          <div className="space-y-4">
            <div className="h-32 animate-pulse rounded-xl border border-border bg-muted/40" />
            <div className="h-56 animate-pulse rounded-xl border border-border bg-muted/40" />
            <div className="h-40 animate-pulse rounded-xl border border-border bg-muted/40" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default EditProductWrapper;

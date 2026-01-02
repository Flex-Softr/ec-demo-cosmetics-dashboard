"use client";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
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
  // Assuming 'params' and 'skipToken' are available in this scope,
  // or that 'productId' should be used instead of 'params.productId'.
  // For now, I'll use 'productId' as it's available in the component props.
  // If 'params' and 'skipToken' are intended, they would need to be defined or imported.
  const { isLoading } = useGetAProductQuery(
    productId // Changed from params.productId ? params.productId : skipToken to productId
  ) as { data: TProduct | null; isLoading: boolean };

  // Assuming useUpdateProductMutation is imported from somewhere, e.g., productsApi
  // const [updateProduct, { isSuccess, isError, error }] = useUpdateProductMutation();

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

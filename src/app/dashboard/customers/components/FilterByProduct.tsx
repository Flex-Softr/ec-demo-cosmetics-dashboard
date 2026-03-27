"use client";
import { PRODUCT_STATUS } from "@/const/products";
import { setSelectedProduct } from "@/redux/features/completedOrders/completedOrdersSlice";
import { useGetAdminProductsQuery } from "@/redux/features/products/productsApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const FilterByProduct = () => {
  const dispatch = useAppDispatch();
  const { selectedProduct } = useAppSelector(
    ({ completedOrders }) => completedOrders
  );

  const { data, isLoading } = useGetAdminProductsQuery({
    status: PRODUCT_STATUS.PUBLISHED,
    sort: "-createdAt",
    limit: 0,
  });

  return (
    <div>
      <select
        onChange={(e) => dispatch(setSelectedProduct(e.target.value))}
        value={selectedProduct}
        className="w-44 h-9 border border-primary outline-primary rounded-md"
        disabled={isLoading}
      >
        <option value="">-- Select Product --</option>
        {!isLoading &&
          Array.isArray(data?.data?.data) &&
          data.data.data.map(
            ({ _id, title }: { _id: string; title: string }) => (
              <option value={_id} key={_id}>
                {title}
              </option>
            )
          )}
      </select>
    </div>
  );
};

export default FilterByProduct;

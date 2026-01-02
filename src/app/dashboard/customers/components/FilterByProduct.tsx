"use client";
import { setSelectedProduct } from "@/redux/features/customerOrders/customerOrdersSlice";
import { useGetProductsQuery } from "@/redux/features/products/productsApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const FilterByProduct = () => {
  const dispatch = useAppDispatch();
  const { selectedProduct } = useAppSelector(
    ({ customerOrders }) => customerOrders
  );

  const { data, isLoading } = useGetProductsQuery({
    limit: 1000,
    sort: "-createdAt",
    page: 1,
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

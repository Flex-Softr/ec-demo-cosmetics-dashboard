"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_STATUS } from "@/const/products";
import { setSelectedProduct } from "@/redux/features/completedOrders/completedOrdersSlice";
import { useGetAdminProductsQuery } from "@/redux/features/products/productsApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const ALL_VALUE = "all";

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

  const products =
    !isLoading && Array.isArray(data?.data?.data) ? data.data.data : [];

  return (
    <Select
      value={selectedProduct || ALL_VALUE}
      onValueChange={(value) =>
        dispatch(setSelectedProduct(value === ALL_VALUE ? "" : value))
      }
      disabled={isLoading}
    >
      <SelectTrigger className="h-10 w-44 rounded-lg">
        <SelectValue placeholder="Select Product" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>All Products</SelectItem>
        {products.map(({ _id, title }: { _id: string; title: string }) => (
          <SelectItem value={_id} key={_id}>
            {title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterByProduct;

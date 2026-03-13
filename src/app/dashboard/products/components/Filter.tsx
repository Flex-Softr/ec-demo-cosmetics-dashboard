"use client";
import { stockStatusOptions } from "@/const/products";
import { useGetBrandsQuery } from "@/redux/features/brand/brandApi";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useGetCollectionsQuery } from "@/redux/features/collection/collectionApi";
import {
  setIsLoading,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { useGetAdminProductsQuery } from "@/redux/features/products/productsApi";
import {
  setProducts,
  setSearch,
  setSearchQuery,
  setSearchedProducts,
} from "@/redux/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import { TCategories } from "@/app/dashboard/category/lib/category.interface";

const Filter = () => {
  const { data: categoriesData } = useGetCategoriesQuery({});
  const categories: TCategories[] = categoriesData?.data?.data || [];

  const { data: collectionsData } = useGetCollectionsQuery({ isActive: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collectionsDataRes = collectionsData?.data?.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collections: any[] = Array.isArray(collectionsDataRes)
    ? collectionsDataRes
    : [];

  const { data: brandsData } = useGetBrandsQuery({});
  const brands = brandsData?.data?.data || [];

  // const router = useRouter();
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStatus] = useState("");

  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector(({ pagination }) => pagination);
  const { selectedStatus: filter, products } = useAppSelector(
    ({ products }) => products
  );

  if (!products.length && page > 1) {
    dispatch(setPage(1));
  }
  const {
    data,
    isLoading: loading,
    error,
  } = useGetAdminProductsQuery({
    status: filter === "all" ? "" : filter,
    category: category === "All Categories" ? "" : category,
    collection: collection === "All Collections" ? "" : collection,
    brand: brand === "All Brands" ? "" : brand,
    stock: stock === "All Product Stock" ? "" : stock,
    sort: "-createdAt",
    page,
    limit,
  });

  useEffect(() => {
    if (loading) {
      dispatch(setIsLoading(true));
    }
    if (data) {
      const { meta, data: products } = data;
      if (meta) {
        dispatch(setTotalPage(meta));
      }
      dispatch(setProducts(products?.data));
      dispatch(setSearch(false));
      dispatch(setSearchQuery(""));
      dispatch(setSearchedProducts([]));
      dispatch(setIsLoading(false));
    }
    if (error) {
      throw new Error("Something went wrong!");
    }
  }, [data, loading, error, dispatch]);

  return (
    <div className="flex items-center gap-10">
      <Select onValueChange={(value) => setCategory(value)}>
        <SelectTrigger className="border-primary focus:ring-primary focus:ring-1">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="All Categories">All Categories</SelectItem>
            {categories.map(
              ({ _id, name, productCount = 0, subcategories = [] }) => (
                <div key={_id}>
                  <SelectItem value={_id} className="font-bold">
                    {name} {productCount > 0 && `(${productCount})`}
                  </SelectItem>
                  {subcategories.length > 0 &&
                    subcategories.map(({ _id, name, productCount = 0 }) => (
                      <SelectItem key={_id} value={_id} className="pl-4">
                        {name} {productCount > 0 && `(${productCount})`}
                      </SelectItem>
                    ))}
                </div>
              )
            )}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => setCollection(value)}>
        <SelectTrigger className="border-primary focus:ring-primary focus:ring-1">
          <SelectValue placeholder="All Collections" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="All Collections">All Collections</SelectItem>
            {collections?.map((col) => (
              <SelectItem key={col._id} value={col._id} className="font-bold">
                {col.title} {col.productCount > 0 && `(${col.productCount})`}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => setBrand(value)}>
        <SelectTrigger className="border-primary focus:ring-primary focus:ring-1">
          <SelectValue placeholder="All Brands" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="All Brands">All Brands</SelectItem>
            {brands?.map((b) => (
              <SelectItem key={b._id} value={b._id} className="font-bold">
                {b.name} {b.productCount > 0 && `(${b.productCount})`}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => setStatus(value)}>
        <SelectTrigger className="border-primary focus:ring-primary focus:ring-1">
          <SelectValue placeholder="All Product Stock" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="capitalize">
            <SelectItem value="All Product Stock">All Product Stock</SelectItem>
            {stockStatusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
            {/* <SelectItem value="On backorder">On backorder</SelectItem> */}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* <Button onClick={handleSubmit} disabled={isLoading}>
        Filter
      </Button> */}
    </div>
  );
};

export default Filter;

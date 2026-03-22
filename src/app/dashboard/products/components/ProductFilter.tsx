"use client";
import CommonSelect from "@/components/commonSelect/CommonSelect";
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
import { useEffect, useState } from "react";
import { TCategories } from "@/app/dashboard/category/lib/category.interface";

const ProductFilter = () => {
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

  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStatus] = useState("");

  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector(({ pagination }) => pagination);
  const { selectedStatus: filter, products } = useAppSelector(
    ({ products }) => products
  );

  const categoryOptions = [
    { label: "All Categories", value: "All Categories" },
    ...categories.map((cat) => ({
      label: cat.name,
      value: cat._id,
      count: cat.productCount,
      children: cat.subcategories?.map((sub) => ({
        label: sub.name,
        value: sub._id,
        count: sub.productCount,
      })),
    })),
  ];

  const collectionOptions = [
    { label: "All Collections", value: "All Collections" },
    ...collections.map((col) => ({
      label: col.name,
      value: col._id,
      count: col.productCount,
    })),
  ];

  const brandOptions = [
    { label: "All Brands", value: "All Brands" },
    ...brands.map((b) => ({
      label: b.name,
      value: b._id,
      count: b.productCount,
    })),
  ];

  const stockOptions = [
    { label: "All Product Stock", value: "All Product Stock" },
    ...stockStatusOptions,
  ];

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
    sort: "-updatedAt",
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
    <div className="flex items-center gap-5 justify-between w-auto">
      <CommonSelect
        options={categoryOptions}
        value={category}
        onChange={(value) => setCategory(value)}
        placeholder="All Categories"
        className="border-primary"
      />

      <CommonSelect
        options={collectionOptions}
        value={collection}
        onChange={(value) => setCollection(value)}
        placeholder="All Collections"
        className="border-primary"
      />

      <CommonSelect
        options={brandOptions}
        value={brand}
        onChange={(value) => setBrand(value)}
        placeholder="All Brands"
        className="border-primary"
      />

      <CommonSelect
        options={stockOptions}
        value={stock}
        onChange={(value) => setStatus(value)}
        placeholder="All Product Stock"
        className="border-primary"
      />
    </div>
  );
};

export default ProductFilter;

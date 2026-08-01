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
  setCountsByStatus,
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

  useEffect(() => {
    if (!products.length && page > 1) {
      dispatch(setPage(1));
    }
  }, [products.length, page, dispatch]);
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
      dispatch(setCountsByStatus(products?.countsByStatus));
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
    <div className="flex w-auto flex-wrap items-center gap-2">
      <CommonSelect
        options={categoryOptions}
        value={category}
        onChange={(value) => {
          setCategory(value);
          dispatch(setPage(1));
        }}
        placeholder="All Categories"
        className="h-10 w-36 rounded-lg"
      />

      <CommonSelect
        options={collectionOptions}
        value={collection}
        onChange={(value) => {
          setCollection(value);
          dispatch(setPage(1));
        }}
        placeholder="All Collections"
        className="h-10 w-36 rounded-lg"
      />

      <CommonSelect
        options={brandOptions}
        value={brand}
        onChange={(value) => {
          setBrand(value);
          dispatch(setPage(1));
        }}
        placeholder="All Brands"
        className="h-10 w-36 rounded-lg"
      />

      <CommonSelect
        options={stockOptions}
        value={stock}
        onChange={(value) => {
          setStatus(value);
          dispatch(setPage(1));
        }}
        placeholder="All Product Stock"
        className="h-10 w-40 rounded-lg"
      />
    </div>
  );
};

export default ProductFilter;

"use client";
import { Input } from "@/components/ui/input";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setIsLoading,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { PagePagination } from "@/components/pagination/PagePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";

import { TCategories } from "../lib/category.interface";
export type { TCategories };
import CategoryForm from "./CategoryForm";
import { CategoryTableBase } from "./CategoryTableBase";

export const CategoryTable = () => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector(({ pagination }) => pagination);

  const [globalFilter, setGlobalFilter] = React.useState("");
  const debunce = useDebounce(globalFilter, 500);
  const queryParams = debunce ? { search: debunce } : { page, limit };

  const { data: response, isLoading } = useGetCategoriesQuery(queryParams);

  const categories = response?.data?.data || [];
  const meta = response?.data?.meta;

  if (!categories.length && page > 1) {
    dispatch(setPage(1));
  }

  React.useEffect(() => {
    if (meta) {
      dispatch(setTotalPage({ total: meta.total, totalPage: meta.totalPage }));
    }
  }, [meta, dispatch]);

  React.useEffect(() => {
    dispatch(setIsLoading(isLoading));
  }, [isLoading, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-1">
      <div className="bg-white py-3 px-4 rounded-lg shadow-sm space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-dark">Category Management</h1>
          <CategoryForm trigger={<Button size="sm">Add Category</Button>} />
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search categories..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-xs h-8 text-sm focus-visible:ring-primary"
          />
        </div>
      </div>

      <CategoryTableBase
        data={categories}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isLoading={isLoading}
      />

      {!globalFilter && (
        <div className="flex items-center justify-end space-x-2 py-2">
          <PagePagination />
        </div>
      )}
    </div>
  );
};

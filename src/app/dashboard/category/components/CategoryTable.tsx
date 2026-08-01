"use client";
import { PagePagination } from "@/components/pagination/PagePagination";
import TableSearch from "@/components/tableSearch/TableSearch";
import { useDebounce } from "@/hooks/useDebounce";
import {
  setIsLoading,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import * as React from "react";
import { TCategories } from "../lib/category.interface";
export type { TCategories };
import { CategoryTableBase } from "./CategoryTableBase";

export const CategoryTable = () => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector(({ pagination }) => pagination);

  const [globalFilter, setGlobalFilter] = React.useState("");
  const debounced = useDebounce(globalFilter, 500);
  const queryParams = debounced ? { search: debounced } : { page, limit };

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <TableSearch
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Search categories…"
        />
      </div>

      <CategoryTableBase
        data={categories}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isLoading={isLoading}
      />

      {!globalFilter && (
        <div className="flex items-center justify-end py-1">
          <PagePagination />
        </div>
      )}
    </div>
  );
};

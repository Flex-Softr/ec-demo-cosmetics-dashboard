"use client";
import { Button } from "@/components/ui/button";
import {
  setProducts,
  setSelectedStatus,
  setSearch,
  setSearchQuery,
  setSearchedProducts,
} from "@/redux/features/allProducts/allProductsSlice";
import {
  setIsLoading,
  setLimit,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import backgroundColor from "@/utilities/backgroundColor";
import borderColor from "@/utilities/borderColor";
// import DateRangeSelector from "@/components/DateRangeSelector";
import { useGetAllProductsQuery } from "@/redux/features/allProducts/allProductsApi";
import { useEffect, useState } from "react";

const CountByStatusButtons = () => {
  const dispatch = useAppDispatch();
  const { page, limit, isLoading } = useAppSelector(
    ({ pagination }) => pagination
  );
  const { selectedStatus: filter, products } = useAppSelector(
    ({ allProducts }) => allProducts
  );

  if (!products.length && page > 1) {
    dispatch(setPage(1));
  }
  const [productStatusCount, setCountByStatus] = useState([]);
  const {
    data,
    isLoading: loading,
    error,
  } = useGetAllProductsQuery({
    status: filter,
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
      dispatch(setTotalPage(meta));
      setCountByStatus(products?.countsByStatus);
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
    <div className="flex flex-wrap items-center justify-start gap-5">
      {productStatusCount?.map((status: { name: string; total: string }) => {
        const bg = `${backgroundColor(status.name)} text-white`;
        return (
          <Button
            key={status.name}
            onClick={() => {
              dispatch(setTotalPage({ total: status.total }));
              dispatch(setLimit(limit));
              dispatch(setSelectedStatus(status.name));
            }}
            disabled={isLoading}
            className={`capitalize bg-white flex items-center gap-1 rounded-2xl ${borderColor(status.name)} ${filter === status.name ? bg : ""}`}
            title={
              status.name == "Draft"
                ? "Draft products will be automatically deleted after 30 days."
                : undefined
            }
          >
            <span>{status.name}</span>
            <span>({status.total})</span>
          </Button>
        );
      })}
      {/* <div>
        <DateRangeSelector />
      </div> */}
    </div>
  );
};

export default CountByStatusButtons;

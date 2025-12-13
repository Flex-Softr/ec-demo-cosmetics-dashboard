"use client";
import { Input } from "@/components/ui/input";
import {
  setIsLoading,
  // setPage,
} from "@/redux/features/pagination/PaginationSlice";
import {
  setSearch,
  setSearchQuery,
  setSearchedProducts,
} from "@/redux/features/allProducts/allProductsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import fetchData from "@/utilities/fetchData";
import { Search, X } from "lucide-react";
import { SetStateAction } from "react";

const ProductSearchBar = ({ endPoint }: { endPoint: string }) => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(
    ({ allProducts }) => allProducts.searchQuery
  );
  const { isLoading } = useAppSelector(({ pagination }) => pagination);

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleClearSearch = () => {
    dispatch(setSearch(false));
    dispatch(setSearchQuery(""));
    dispatch(setSearchedProducts([]));
  };

  const handleSearch = async () => {
    if (searchQuery) {
      dispatch(setIsLoading(true));
      const { data } = await fetchData({
        endPoint,
        // tags: ["allOrders"],
        searchParams: {
          search: searchQuery,
          sort: "-createdAt",
        },
      });
      dispatch(setSearchedProducts(data?.data));
      dispatch(setIsLoading(false));
      dispatch(setSearch(true));
    }
  };

  const handleKeyPress = (e: { key: string; repeat: unknown }) => {
    if (e.key === "Enter" && !e.repeat) {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center justify-end">
      <div className="flex w-[400px] justify-center items-center overflow-hidden rounded-full relative">
        <Input
          type="search"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          disabled={searchQuery && isLoading ? true : false}
          className="p-5 w-full outline-none ring-1 ring-primary rounded-full rounded-r-none border-r-0 border-secondary h-[40px]"
          placeholder="Search products"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-11 text-primary"
          >
            <X className="w-6 h-6" />
          </button>
        )}
        <button
          onClick={handleSearch}
          disabled={searchQuery && isLoading ? true : false}
          className="font-bold w-[45px] flex justify-center items-center outline-none ring-1 ring-primary rounded-full rounded-l-none border-l-0 border-secondary bg-secondary h-[40px] text-white"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ProductSearchBar;

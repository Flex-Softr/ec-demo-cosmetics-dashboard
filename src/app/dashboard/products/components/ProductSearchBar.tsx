"use client";
import { Input } from "@/components/ui/input";
import { setIsLoading } from "@/redux/features/pagination/PaginationSlice";
import {
  setSearch,
  setSearchedProducts,
  setSearchQuery,
} from "@/redux/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import fetchData from "@/utilities/fetchData";
import { Search, X } from "lucide-react";
import { SetStateAction } from "react";

const ProductSearchBar = ({ endPoint }: { endPoint: string }) => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(({ products }) => products.searchQuery);
  const { isLoading } = useAppSelector(({ pagination }) => pagination);
  const { selectedStatus } = useAppSelector(({ products }) => products);

  const handleClearSearch = () => {
    dispatch(setSearch(false));
    dispatch(setSearchQuery(""));
    dispatch(setSearchedProducts([]));
  };

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    const value = e.target.value;
    dispatch(setSearchQuery(value));
    if (value === "") {
      handleClearSearch();
    }
  };

  const handleSearch = async () => {
    if (searchQuery) {
      dispatch(setIsLoading(true));

      const { data } = await fetchData({
        endPoint,
        searchParams: {
          status: selectedStatus,
          search: searchQuery,
          sort: "-createdAt",
        },
        cache: "no-store",
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
      <div className="flex w-[400px] justify-center items-center overflow-hidden rounded-md relative">
        <Input
          type="search"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          disabled={searchQuery && isLoading ? true : false}
          className="p-5 w-md outline-none ring-1 ring-primary rounded-md rounded-r-none border-r-0 border-primary h-[40px] [&::-webkit-search-cancel-button]:appearance-none"
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
          className="font-bold w-[45px] flex justify-center items-center outline-none ring-1 ring-primary rounded-md rounded-l-none border-l-0 border-primary bg-primary h-[40px] text-white"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ProductSearchBar;

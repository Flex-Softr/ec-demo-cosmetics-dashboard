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
    <div className="relative w-full sm:w-64">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        disabled={Boolean(searchQuery && isLoading)}
        className="h-10 rounded-lg border-border bg-card pl-8 pr-16 text-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 [&::-webkit-search-cancel-button]:appearance-none"
        placeholder="Search products…"
      />
      {searchQuery ? (
        <button
          type="button"
          onClick={handleClearSearch}
          className="absolute right-9 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
      <button
        type="button"
        onClick={handleSearch}
        disabled={Boolean(searchQuery && isLoading)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-primary hover:bg-primary/10 disabled:opacity-50"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ProductSearchBar;

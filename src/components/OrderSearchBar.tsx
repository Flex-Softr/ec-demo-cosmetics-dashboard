"use client";
import { Input } from "@/components/ui/input";
import { setIsLoading } from "@/redux/features/pagination/PaginationSlice";
import {
  setSearch,
  setSearchQuery,
  setSearchedOrders,
} from "@/redux/features/search/searchSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import fetchData from "@/utilities/fetchData";
import { Search, X } from "lucide-react";
import { SetStateAction } from "react";

const OrderSearchBar = ({ endPoint }: { endPoint: string }) => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(({ search }) => search.searchQuery);
  const { isLoading } = useAppSelector(({ pagination }) => pagination);

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleClearSearch = () => {
    dispatch(setSearch(false));
    dispatch(setSearchQuery(""));
    dispatch(setSearchedOrders([]));
  };

  const handleSearch = async () => {
    if (searchQuery) {
      dispatch(setIsLoading(true));
      const { data } = await fetchData({
        endPoint,
        cache: "no-store",
        searchParams: {
          search: searchQuery,
          sort: "-createdAt",
        },
      });
      dispatch(setSearchedOrders(data?.data));
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
        placeholder="Search orders…"
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

export default OrderSearchBar;

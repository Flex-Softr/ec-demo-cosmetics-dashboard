"use client";

import { Input } from "@/components/ui/input";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { setIsUsersLoading, setUsers } from "@/redux/features/user/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Search, X } from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";

const SearchEmployee = () => {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const { data, isLoading } = useGetAllUsersQuery({ search });

  const [searchQuery, setSearchQuery] = useState("");
  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearch(undefined);
  };

  const handleKeyPress = (e: { key: string; repeat: unknown }) => {
    if (searchQuery.length - 1 === 0) setSearch(undefined);
    if (e.key === "Enter" && !e.repeat) handleSearch();
  };

  const handleSearch = async () => {
    if (searchQuery) {
      setSearch(searchQuery);
    }
  };

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setUsers(data?.data || []));
    dispatch(setIsUsersLoading(isLoading));
  }, [data, isLoading, dispatch]);

  return (
    <div className="relative w-full sm:w-64">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        className="h-10 rounded-lg border-border bg-card pl-8 pr-16 text-sm focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 [&::-webkit-search-cancel-button]:appearance-none"
        placeholder="Search employees…"
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
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-primary hover:bg-primary/10"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SearchEmployee;

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
    <div>
      <div className="flex items-center justify-end">
        <div className="flex w-[400px] justify-center items-center overflow-hidden rounded-full relative">
          <Input
            type="search"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            //   disabled={searchQuery && isLoading ? true : false}
            className="p-5 w-full outline-none ring-1 ring-primary rounded-full rounded-r-none border-r-0 border-secondary h-[40px]"
            placeholder="Search employee"
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
            //   disabled={searchQuery && isLoading ? true : false}
            className="font-bold w-[45px] flex justify-center items-center outline-none ring-1 ring-primary rounded-full rounded-l-none border-l-0 border-secondary bg-secondary h-[40px] text-white"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchEmployee;

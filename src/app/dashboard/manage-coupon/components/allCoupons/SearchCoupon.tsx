"use client";

import { Input } from "@/components/ui/input";
import { setCouponSearch } from "@/redux/features/coupon/couponSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Search, X } from "lucide-react";
import { SetStateAction, useState } from "react";

const SearchCoupon = () => {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchQuery(e?.target?.value as string);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    dispatch(setCouponSearch(undefined));
  };

  const handleKeyPress = (e: { key: string; repeat: unknown }) => {
    if ((searchQuery?.length || 1) - 1 === 0) setSearchQuery(undefined);
    if (e.key === "Enter" && !e.repeat) handleSearch();
  };

  const dispatch = useAppDispatch();

  const handleSearch = async () => {
    dispatch(setCouponSearch(searchQuery));
  };

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
            placeholder="Search coupon"
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

export default SearchCoupon;

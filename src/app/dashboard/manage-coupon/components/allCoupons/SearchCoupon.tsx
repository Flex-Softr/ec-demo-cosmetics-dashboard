"use client";

import TableSearch from "@/components/tableSearch/TableSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { setCouponSearch } from "@/redux/features/coupon/couponSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect, useState } from "react";

const SearchCoupon = () => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    dispatch(setCouponSearch(debouncedSearch || undefined));
  }, [debouncedSearch, dispatch]);

  return (
    <TableSearch
      value={searchQuery}
      onChange={setSearchQuery}
      placeholder="Search coupons…"
    />
  );
};

export default SearchCoupon;

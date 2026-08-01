"use client";

import TableSearch from "@/components/tableSearch/TableSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { setRegisteredUserSearch } from "@/redux/features/registeredCustomer/RegisteredCustomerSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect, useState } from "react";

const SearchRegisteredUser = () => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    dispatch(setRegisteredUserSearch(debouncedSearch || undefined));
  }, [debouncedSearch, dispatch]);

  return (
    <TableSearch
      value={searchQuery}
      onChange={setSearchQuery}
      placeholder="Search customers…"
    />
  );
};

export default SearchRegisteredUser;

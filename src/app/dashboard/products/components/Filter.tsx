"use client";
import {
  setProducts,
  setSearch,
  setSearchQuery,
  setSearchedProducts,
} from "@/redux/features/allProducts/allProductsSlice";
import {
  setIsLoading,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetAllProductsQuery } from "@/redux/features/allProducts/allProductsApi";

// import { Button } from "@/components/ui/button";
// import queryHelper from "@/utilities/queryHelper";
// import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

type TCategory = {
  _id: string;
  name: string;
  subcategories: {
    _id: string;
    name: string;
  }[];
};

const Filter = ({ categories }: { categories: TCategory[] }) => {
  // const router = useRouter();
  const [category, setCategory] = useState("");
  const [stock, setStatus] = useState("");

  // const handleSubmit = async () => {
  //   router.push(`/dashboard/all-products?${queryHelper({ category, stock })}`);
  // };

  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector(({ pagination }) => pagination);
  const { selectedStatus: filter, products } = useAppSelector(
    ({ allProducts }) => allProducts
  );

  if (!products.length && page > 1) {
    dispatch(setPage(1));
  }
  const {
    data,
    isLoading: loading,
    error,
  } = useGetAllProductsQuery({
    status: filter,
    category: category === "All Categories" ? "" : category,
    stock: stock === "All Product Stock" ? "" : stock,
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
    <div className="flex items-center gap-10">
      <Select onValueChange={(value) => setCategory(value)}>
        <SelectTrigger className="border-primary focus:ring-primary focus:ring-1">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="All Categories">All Categories</SelectItem>
            {categories.map(({ _id, name, subcategories }) => (
              <div key={_id}>
                <SelectItem value={_id} className="font-bold">
                  {name}
                </SelectItem>
                {subcategories.length > 0 &&
                  subcategories.map(({ _id, name }) => (
                    <SelectItem key={_id} value={_id} className="pl-4">
                      {name}
                    </SelectItem>
                  ))}
              </div>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => setStatus(value)}>
        <SelectTrigger className="border-primary focus:ring-primary focus:ring-1">
          <SelectValue placeholder="All Product Stock" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="capitalize">
            <SelectItem value="All Product Stock">All Product Stock</SelectItem>
            <SelectItem value="In stock">In stock</SelectItem>
            <SelectItem value="Out of stock">Out of stock</SelectItem>
            {/* <SelectItem value="On backorder">On backorder</SelectItem> */}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* <Button onClick={handleSubmit} disabled={isLoading}>
        Filter
      </Button> */}
    </div>
  );
};

export default Filter;

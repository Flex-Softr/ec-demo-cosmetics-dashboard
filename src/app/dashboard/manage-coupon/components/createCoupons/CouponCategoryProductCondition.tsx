"use client";

import { TCategories } from "@/app/dashboard/category/components/CategoryTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TProduct } from "@/redux/features/addProduct/interface";
import { useGetAllProductsQuery } from "@/redux/features/allProducts/allProductsApi";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { Dispatch, SetStateAction } from "react";
import Select, { MultiValue } from "react-select";

export type TSelectOption = MultiValue<{ value: string; label: string }>;

const CouponCategoryProductCondition = ({
  restrictedCategories,
  fixedProducts,
  fixedCategories,
  setFixedProducts,
  setFixedCategories,
  setRestrictedCategories,
}: {
  fixedCategories: TSelectOption;
  fixedProducts: TSelectOption;
  restrictedCategories: TSelectOption;
  setFixedProducts: Dispatch<SetStateAction<TSelectOption>>;
  setFixedCategories: Dispatch<SetStateAction<TSelectOption>>;
  setRestrictedCategories: Dispatch<SetStateAction<TSelectOption>>;
}) => {
  const { data: productRes } = useGetAllProductsQuery({ page: 1, limit: 1000 });
  const { data: categoryRes } = useGetCategoriesQuery({});

  const product = (productRes?.data?.data as TProduct[]) || [];

  const productOptions = product.map((item) => ({
    value: item?._id || "",
    label: item?.title || "",
  }));

  const categories = (categoryRes?.data as TCategories[]) || [];
  const categoryOptions = categories.map((item) => ({
    value: item?._id || "",
    label: item?.name || "",
  }));

  return (
    <Tabs defaultValue="Fixed category" className="">
      <TabsList className="grid w-full grid-cols-3 justify-center">
        <TabsTrigger value="Fixed category">Fixed category</TabsTrigger>
        <TabsTrigger value="Fixed products">Fixed products</TabsTrigger>
        <TabsTrigger value="Restricted category">
          Restricted category
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Fixed category">
        <Select
          options={categoryOptions}
          isMulti={true}
          isSearchable={true}
          isClearable={true}
          onChange={(v) => setFixedCategories(v)}
          value={fixedCategories}
        />
      </TabsContent>
      <TabsContent value="Fixed products">
        <Select
          options={productOptions}
          isMulti={true}
          isSearchable={true}
          isClearable={true}
          onChange={(v) => setFixedProducts(v)}
          value={fixedProducts}
        />
      </TabsContent>
      <TabsContent value="Restricted category">
        <Select
          options={categoryOptions}
          isMulti={true}
          isSearchable={true}
          isClearable={true}
          onChange={(v) => setRestrictedCategories(v)}
          value={restrictedCategories}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CouponCategoryProductCondition;

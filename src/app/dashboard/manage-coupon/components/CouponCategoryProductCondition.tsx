/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TCategories } from "@/app/dashboard/category/components/CategoryTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRODUCT_STATUS } from "@/const/products";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useGetAdminProductsQuery } from "@/redux/features/products/productsApi";
import { IAdminProduct } from "@/types/products";
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
  const { data: productRes } = useGetAdminProductsQuery({
    status: PRODUCT_STATUS.PUBLISHED,
    sort: "-createdAt",
    limit: 0,
  });
  const { data: categoryRes } = useGetCategoriesQuery({});

  const product = (productRes?.data?.data as IAdminProduct[]) || [];
  const productOptions = product.map((item) => ({
    value: item?._id || "",
    label: item?.title || "",
  }));

  const responseData: any = categoryRes?.data;
  const categories =
    (responseData?.data as TCategories[]) ||
    (categoryRes?.data?.data as TCategories[]) ||
    [];
  const categoryOptions = categories.map((item) => ({
    value: item?._id || "",
    label: item?.name || "",
  }));

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">
        Category & Product Conditions
      </h3>
      <Tabs defaultValue="Fixed category">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-lg border border-border bg-muted p-1">
          <TabsTrigger
            className="rounded-md px-3 py-1.5 text-xs sm:text-sm"
            value="Fixed category"
          >
            Fixed category
          </TabsTrigger>
          <TabsTrigger
            className="rounded-md px-3 py-1.5 text-xs sm:text-sm"
            value="Fixed products"
          >
            Fixed products
          </TabsTrigger>
          <TabsTrigger
            className="rounded-md px-3 py-1.5 text-xs sm:text-sm"
            value="Restricted category"
          >
            Restricted category
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Fixed category" className="mt-3">
          <Select
            options={categoryOptions}
            isMulti
            isSearchable
            isClearable
            placeholder="Select fixed categories…"
            onChange={(v) => setFixedCategories(v)}
            value={fixedCategories}
            classNames={{
              control: () => "!min-h-10 !rounded-lg !border-border",
            }}
          />
        </TabsContent>
        <TabsContent value="Fixed products" className="mt-3">
          <Select
            options={productOptions}
            isMulti
            isSearchable
            isClearable
            placeholder="Select fixed products…"
            onChange={(v) => setFixedProducts(v)}
            value={fixedProducts}
            classNames={{
              control: () => "!min-h-10 !rounded-lg !border-border",
            }}
          />
        </TabsContent>
        <TabsContent value="Restricted category" className="mt-3">
          <Select
            options={categoryOptions}
            isMulti
            isSearchable
            isClearable
            placeholder="Select restricted categories…"
            onChange={(v) => setRestrictedCategories(v)}
            value={restrictedCategories}
            classNames={{
              control: () => "!min-h-10 !rounded-lg !border-border",
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CouponCategoryProductCondition;

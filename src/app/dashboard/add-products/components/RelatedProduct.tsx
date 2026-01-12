"use client";

import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { useGetCustomerProductsQuery } from "@/redux/features/products/productsApi";
import { TProduct } from "@/redux/features/products/productsInterface";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select, { components } from "react-select";

// Shape we keep everywhere for react-select
type ProductOption = {
  value: string; // unique id for react-select
  label: string;
  thumb?: string;
};

export default function RelatedProducts() {
  const { control, watch, setValue } = useFormContext();
  const { data } = useGetCustomerProductsQuery({});

  // Watch the field for the selected items list display
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const relatedProductsRaw = watch("relatedProducts");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const relatedProducts: any[] = useMemo(
    () => relatedProductsRaw || [],
    [relatedProductsRaw]
  );

  // Map API data to react-select options
  const productOptions = useMemo(
    () =>
      data?.data?.map((p: TProduct) => ({
        value: p._id,
        label: p.title,
        thumb: p.thumbnail?.src,
      })) ?? [],
    [data]
  );

  // Effect to hydrate initial IDs into full objects
  useEffect(() => {
    if (
      relatedProducts.length > 0 &&
      typeof relatedProducts[0] === "string" &&
      productOptions.length > 0
    ) {
      // We have IDs but need Objects
      const hydrated = relatedProducts
        .map((id: string) => {
          const found = productOptions.find(
            (opt: ProductOption) => opt.value === id
          );
          return found || { value: id, label: "Loading...", thumb: "" }; // Fallback if not found yet
        })
        .filter((item: ProductOption) => item.label !== "Loading..."); // Optionally filter out missing ones? Or keep them?

      // Update form with fully hydrated objects
      setValue("relatedProducts", hydrated);
    }
  }, [relatedProducts, productOptions, setValue]);
  // The effect re-runs when dependencies change, but checking `typeof relatedProducts[0]` prevents infinite loops once hydrated.

  /** Custom option with image */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Option = (props: any) => (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        <Image
          src={props.data.thumb || "/placeholder.png"}
          alt={props.data.label}
          width={32}
          height={32}
          className="h-8 w-8 rounded object-cover border"
        />
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );

  /** Custom selected value pill */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MultiValueLabel = (props: any) => (
    <components.MultiValueLabel {...props}>
      <div className="flex items-center gap-1">
        <Image
          src={props.data.thumb || "/placeholder.png"}
          alt={props.data.label}
          width={20}
          height={20}
          className="h-5 w-5 rounded object-cover border"
        />
        <span className="truncate max-w-[150px]">{props.data.label}</span>
      </div>
    </components.MultiValueLabel>
  );

  const removeProduct = (value: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = relatedProducts.filter((item: any) => item.value !== value);
    setValue("relatedProducts", updated, { shouldValidate: true });
  };

  return (
    <SectionContentWrapper heading="Related products" className="space-y-4">
      <Controller
        name="relatedProducts"
        control={control}
        render={({ field }) => (
          <Select<ProductOption, true>
            {...field}
            // Ensure value is always an array of objects for react-select
            // If it is currently strings (during hydration), passing it might break select, or it might accept it if we don't strictly type it here.
            // React-Select usually ignores values it doesn't find options for unless we provide them.
            // We should filter field.value to make sure they are objects before passing to Select??
            // Actually, if we pass IDs to value, Select won't show them as selected unless options match?
            // Let's rely on the useEffect to fix it quickly.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={field.value?.filter((v: any) => typeof v === "object") || []}
            isMulti
            isSearchable
            options={productOptions}
            placeholder="Search products"
            className="react-select-container"
            classNamePrefix="react-select"
            components={{ Option, MultiValueLabel }}
            getOptionValue={(opt) => opt.value}
            getOptionLabel={(opt) => opt.label}
            onChange={(newValue) => field.onChange(newValue)}
          />
        )}
      />

      {relatedProducts.length > 0 && typeof relatedProducts[0] === "object" && (
        <div className="space-y-3 mt-4">
          <p className="font-medium">Selected products</p>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {relatedProducts.map((p: any) => (
            <div
              key={p.value}
              className="flex items-center justify-between gap-3 border-b pb-2"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={p.thumb || "/placeholder.png"}
                  alt={p.label}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded object-cover border"
                />
                <span className="text-sm text-gray-400 dark:text-white">
                  {p.label}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeProduct(p.value);
                }}
                type="button"
                className="cursor-pointer text-red-500 hover:text-red-600 text-lg"
              >
                <X />
              </button>
            </div>
          ))}
        </div>
      )}
    </SectionContentWrapper>
  );
}

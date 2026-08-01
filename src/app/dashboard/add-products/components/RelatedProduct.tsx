"use client";

import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import MultiSelect, { MultiSelectOption } from "@/components/ui/multi-select";
import { useGetCustomerProductsQuery } from "@/redux/features/products/productsApi";
import { TProduct } from "@/redux/features/products/productsInterface";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

type ProductOption = MultiSelectOption & {
  thumb?: string;
};

export default function RelatedProducts() {
  const { control, watch, setValue } = useFormContext();
  const { data } = useGetCustomerProductsQuery({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const relatedProductsRaw = watch("relatedProducts");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const relatedProducts: any[] = useMemo(
    () => relatedProductsRaw || [],
    [relatedProductsRaw]
  );

  const productOptions: ProductOption[] = useMemo(
    () =>
      data?.data?.map((p: TProduct) => ({
        value: p._id,
        label: p.title,
        thumb: p.thumbnail?.src,
      })) ?? [],
    [data]
  );

  useEffect(() => {
    if (
      relatedProducts.length > 0 &&
      typeof relatedProducts[0] === "string" &&
      productOptions.length > 0
    ) {
      const hydrated = relatedProducts
        .map((id: string) => {
          const found = productOptions.find((opt) => opt.value === id);
          return found || { value: id, label: "Loading...", thumb: "" };
        })
        .filter((item: ProductOption) => item.label !== "Loading...");

      setValue("relatedProducts", hydrated);
    }
  }, [relatedProducts, productOptions, setValue]);

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
          <MultiSelect
            options={productOptions}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={field.value?.filter((v: any) => typeof v === "object") || []}
            onChange={(newValue) => field.onChange(newValue)}
            placeholder="Search products"
            renderOption={(option) => (
              <span className="flex items-center gap-2">
                <Image
                  src={(option as ProductOption).thumb || "/placeholder.png"}
                  alt={option.label}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded border object-cover"
                />
                <span className="truncate">{option.label}</span>
              </span>
            )}
            renderSelected={(option) => (
              <span className="flex items-center gap-1">
                <Image
                  src={(option as ProductOption).thumb || "/placeholder.png"}
                  alt={option.label}
                  width={16}
                  height={16}
                  className="h-4 w-4 rounded border object-cover"
                />
                <span className="max-w-[120px] truncate">{option.label}</span>
              </span>
            )}
          />
        )}
      />

      {relatedProducts.length > 0 && typeof relatedProducts[0] === "object" && (
        <div className="mt-4 space-y-3">
          <p className="font-medium text-foreground">Selected products</p>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {relatedProducts.map((p: any) => (
            <div
              key={p.value}
              className="flex items-center justify-between gap-3 border-b border-border pb-2"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={p.thumb || "/placeholder.png"}
                  alt={p.label}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded border object-cover"
                />
                <span className="text-sm text-muted-foreground">{p.label}</span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeProduct(p.value);
                }}
                type="button"
                className="cursor-pointer text-destructive hover:opacity-80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </SectionContentWrapper>
  );
}

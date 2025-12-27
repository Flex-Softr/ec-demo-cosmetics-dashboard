/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useGetACustomerProductQuery } from "@/redux/features/allProducts/allProductsApi";
import { useEffect } from "react";
import {
  Control,
  FieldValues,
  Path,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";

type Variation = { _id: string; price: Record<string, unknown> };
// Update the type constraint for T
type VariationOptionsProps<T extends FieldValues> = {
  index: number;
  control: Control<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  orderedProducts: "orderedProducts" | "productDetails";
  product: "product" | "newProductId";
  variations?: Variation[];
  setVariations?: React.Dispatch<React.SetStateAction<Variation[]>>;
  initialAttributes?: Record<string, any>;
};

const VariationOptions = <T extends FieldValues>(
  props: VariationOptionsProps<T>
) => {
  const {
    index,
    register,
    control,
    setValue,
    clearErrors,
    orderedProducts,
    product,
    variations = [],
    setVariations,
    initialAttributes,
  } = props;
  // inside your component
  const productId = useWatch({
    control,
    name: `${orderedProducts}.${index}.${product}` as Path<T>,
  });

  const { data } = useGetACustomerProductQuery(productId ?? "null");

  const variationId = useWatch({
    control,
    name: `${orderedProducts}.${index}.variation` as Path<T>,
  });

  useEffect(() => {
    if (data?.variations?.length) {
      // 1. Logic to set variations array for parent component (existing logic)
      const selectedVariation = data.variations.find(
        (variation: { _id: string }) => variation._id === variationId
      );
      if (selectedVariation) {
        setVariations?.([...variations, selectedVariation]);
      }

      // 2. Logic to auto-select variation based on initialAttributes (new logic)
      if (!variationId && initialAttributes) {
        const matchingVariation = data.variations.find(
          (v: { attributes: Record<string, any>; _id: string }) => {
            // Compare attributes. Keys match and values match.
            // Using JSON stringify for simple comparison if order matches, but safer to compare entries.
            // Attributes from backend might have extra keys? Or order difference?
            // Let's do a key-value check.
            const vAttrs = v.attributes || {};
            const iAttrs = initialAttributes || {};
            const vKeys = Object.keys(vAttrs);
            const iKeys = Object.keys(iAttrs);

            if (vKeys.length !== iKeys.length) return false;

            return vKeys.every((key) => vAttrs[key] === iAttrs[key]);
          }
        );

        if (matchingVariation) {
          setValue(
            `${orderedProducts}.${index}.variation` as Path<T>,
            matchingVariation._id as any
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setVariations, variationId, initialAttributes, setValue]);

  return (
    <>
      {data?.variations?.length ? (
        <div>
          <select
            {...register(`${orderedProducts}.${index}.variation` as Path<T>)}
            onChange={(e) => {
              register(
                `${orderedProducts}.${index}.variation` as Path<T>
              ).onChange(e);
              if (e.target.value) {
                clearErrors(
                  `${orderedProducts}.${index}.product` as Path<T> as any
                );
              }
            }}
            className="w-full h-8 border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 rounded-md font-semibold"
          >
            <option value="">-- Select Attribute --</option>
            {data?.variations?.map(
              ({
                _id,
                attributes = {},
              }: {
                _id: string;
                attributes: Record<string, unknown>;
              }) => (
                <option value={_id} key={_id}>
                  {Object.keys(attributes)
                    .map((key) => `${attributes[key]} `)
                    .join("")}
                </option>
              )
            )}
          </select>
        </div>
      ) : null}
    </>
  );
};

export default VariationOptions;

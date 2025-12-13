"use client";
import { useGetACustomerProductQuery } from "@/redux/features/allProducts/allProductsApi";
import { useEffect } from "react";
import {
  UseFormRegister,
  FieldValues,
  Path,
  useWatch,
  Control,
} from "react-hook-form";

type Variation = { _id: string; price: Record<string, unknown> };
// Update the type constraint for T
type VariationOptionsProps<T extends FieldValues> = {
  index: number;
  control: Control<T>;
  register: UseFormRegister<T>;
  orderedProducts: "orderedProducts" | "productDetails";
  product: "product" | "newProductId";
  variations?: Variation[];
  setVariations?: React.Dispatch<React.SetStateAction<Variation[]>>;
};

const VariationOptions = <T extends FieldValues>(
  props: VariationOptionsProps<T>
) => {
  const {
    index,
    register,
    control,
    orderedProducts,
    product,
    variations = [],
    setVariations,
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
      const selectedVariation = data.variations.find(
        (variation: { _id: string }) => variation._id === variationId
      );
      if (selectedVariation) {
        setVariations?.([...variations, selectedVariation]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setVariations, variationId]);

  return (
    <>
      {data?.variations?.length ? (
        <div>
          <select
            {...register(`${orderedProducts}.${index}.variation` as Path<T>)}
            className="w-[300px] h-8 border border-primary outline-primary rounded-md"
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

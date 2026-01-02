"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

type TProps = {
  prefix?: string;
};

const Price = ({ prefix = "price" }: TProps) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const regularPrice = watch(`${prefix}.regularPrice`);

  const getError = (fieldName: string) => {
    const path = fieldName.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = errors;
    for (const p of path) {
      if (current?.[p]) {
        current = current[p];
      } else {
        return undefined;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (current as any)?.message as string | undefined;
  };

  const handleRegularPriceChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    const parsed = parseFloat(value);
    const price = value === "" || isNaN(parsed) ? undefined : parsed;

    setValue(`${prefix}.regularPrice`, price, { shouldValidate: true });
    // Reset sale/discount when regular changes
    setValue(`${prefix}.discountPercent`, undefined);
    setValue(`${prefix}.salePrice`, undefined);
  };

  const handleSalePriceChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    const parsed = parseFloat(value);
    const price = value === "" || isNaN(parsed) ? undefined : parsed;

    setValue(`${prefix}.salePrice`, price, { shouldValidate: true });

    if (regularPrice && regularPrice > 0 && price !== undefined) {
      const calculatedDiscount = ((regularPrice - price) / regularPrice) * 100;
      const finalDiscount = isNaN(calculatedDiscount)
        ? undefined
        : parseFloat(calculatedDiscount.toFixed(2));
      setValue(`${prefix}.discountPercent`, finalDiscount);
    }
  };

  const handleDiscountChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    const parsed = parseFloat(value);
    const discount = value === "" || isNaN(parsed) ? undefined : parsed;

    setValue(`${prefix}.discountPercent`, discount, { shouldValidate: true });

    if (regularPrice && regularPrice > 0 && discount !== undefined) {
      const calculatedSalePrice =
        regularPrice - (regularPrice * discount) / 100;
      const finalSalePrice = isNaN(calculatedSalePrice)
        ? undefined
        : parseFloat(calculatedSalePrice.toFixed());
      setValue(`${prefix}.salePrice`, finalSalePrice);
    }
  };

  return (
    <div className="pt-2">
      <div className="flex items-center gap-3">
        <Label className="w-40" htmlFor={`${prefix}.regularPrice`}>
          Price
        </Label>
        <div className="w-full">
          <Input
            type="number"
            min={0}
            step="0.01"
            placeholder="Enter regular price"
            id={`${prefix}.regularPrice`}
            {...register(`${prefix}.regularPrice`, {
              valueAsNumber: true,
              onChange: handleRegularPriceChange,
            })}
          />
        </div>
      </div>
      {getError(`${prefix}.regularPrice`) && (
        <p className="text-red-600 ml-44 mt-2">
          {getError(`${prefix}.regularPrice`)}
        </p>
      )}
      <div className="flex items-center gap-3 mt-3">
        <Label className="w-40" htmlFor={`${prefix}.salePrice`}>
          Sale Price
        </Label>
        <Input
          type="number"
          min={0}
          step="0.01"
          placeholder="Enter sale price"
          id={`${prefix}.salePrice`}
          {...register(`${prefix}.salePrice`, {
            valueAsNumber: true,
            onChange: handleSalePriceChange,
          })}
        />
      </div>
      {getError(`${prefix}.salePrice`) && (
        <p className="text-red-600 ml-40 mt-2">
          {getError(`${prefix}.salePrice`)}
        </p>
      )}
      <div className="flex items-center gap-3 mt-3">
        <Label className="w-40" htmlFor={`${prefix}.discountPercent`}>
          Discount %
        </Label>
        <Input
          type="number"
          min={0}
          step="0.01"
          placeholder="Enter discount percentage"
          id={`${prefix}.discountPercent`}
          {...register(`${prefix}.discountPercent`, {
            valueAsNumber: true,
            onChange: handleDiscountChange,
          })}
        />
      </div>
      {getError(`${prefix}.discountPercent`) && (
        <p className="text-red-600 ml-44 mt-2">
          {getError(`${prefix}.discountPercent`)}
        </p>
      )}
    </div>
  );
};

export default Price;

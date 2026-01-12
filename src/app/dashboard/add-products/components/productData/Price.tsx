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

  // Helper to extract nested errors safely
  const getBindingError = (name: string) => {
    const path = name.split(".");
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

  const calculatePriceSave = (regular: number, sale: number) => {
    if (regular > 0 && sale >= 0 && regular > sale) {
      return regular - sale;
    }
    return 0;
  };

  const handleRegularPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsed = parseFloat(value);
    const price = value === "" || isNaN(parsed) ? undefined : parsed;

    setValue(`${prefix}.regularPrice`, price, { shouldValidate: true });

    // When regular price changes, reset dependent fields to avoid inconsistency
    setValue(`${prefix}.discountPercent`, undefined);
    setValue(`${prefix}.salePrice`, undefined);
    setValue(`${prefix}.priceSave`, undefined);
  };

  const handleSalePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const saved = calculatePriceSave(regularPrice, price);
      setValue(`${prefix}.priceSave`, saved);
    } else {
      setValue(`${prefix}.discountPercent`, undefined);
      setValue(`${prefix}.priceSave`, undefined);
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const saved = calculatePriceSave(regularPrice, finalSalePrice || 0);
      setValue(`${prefix}.priceSave`, saved);
    } else {
      setValue(`${prefix}.salePrice`, undefined);
      setValue(`${prefix}.priceSave`, undefined);
    }
  };

  return (
    <div className="pt-2 space-y-4">
      {/* Regular Price */}
      <div className="flex items-start gap-3">
        <Label
          className="w-40 py-2 cursor-help"
          htmlFor={`${prefix}.regularPrice`}
          title="The regular price of the product."
        >
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
          {getBindingError(`${prefix}.regularPrice`) && (
            <p className="text-red-600 text-sm mt-1">
              {getBindingError(`${prefix}.regularPrice`)}
            </p>
          )}
        </div>
      </div>

      {/* Sale Price */}
      <div className="flex items-start gap-3">
        <Label
          className="w-40 py-2 cursor-help"
          htmlFor={`${prefix}.salePrice`}
          title="The discounted price of the product."
        >
          Sale Price
        </Label>
        <div className="w-full">
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
            disabled={!regularPrice}
          />
          {getBindingError(`${prefix}.salePrice`) && (
            <p className="text-red-600 text-sm mt-1">
              {getBindingError(`${prefix}.salePrice`)}
            </p>
          )}
        </div>
      </div>

      {/* Discount Percent */}
      <div className="flex items-start gap-3">
        <Label
          className="w-40 py-2 cursor-help"
          htmlFor={`${prefix}.discountPercent`}
          title="The discount percentage applied to the regular price."
        >
          Discount %
        </Label>
        <div className="w-full">
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
            disabled={!regularPrice}
          />
          {getBindingError(`${prefix}.discountPercent`) && (
            <p className="text-red-600 text-sm mt-1">
              {getBindingError(`${prefix}.discountPercent`)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Price;

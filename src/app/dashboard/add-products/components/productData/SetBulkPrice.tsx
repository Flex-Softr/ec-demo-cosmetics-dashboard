import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const SetBulkPrice = () => {
  const { setValue, getValues } = useFormContext();

  const [regularPrice, setRegularPrice] = useState<number | undefined>();
  const [salePrice, setSalePrice] = useState<number | undefined>();
  const [discountPercent, setDiscountPercent] = useState<number | undefined>();

  const handleRegularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const price = isNaN(value) ? undefined : value;
    setRegularPrice(price);
    // Reset dependents
    setSalePrice(undefined);
    setDiscountPercent(undefined);
  };

  const handleSaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const price = isNaN(value) ? undefined : value;
    setSalePrice(price);

    if (regularPrice && regularPrice > 0 && price !== undefined) {
      const discount = ((regularPrice - price) / regularPrice) * 100;
      setDiscountPercent(parseFloat(discount.toFixed(2)));
    } else {
      setDiscountPercent(undefined);
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const discount = isNaN(value) ? undefined : value;
    setDiscountPercent(discount);

    if (regularPrice && regularPrice > 0 && discount !== undefined) {
      const sale = regularPrice - (regularPrice * discount) / 100;
      setSalePrice(parseFloat(sale.toFixed(0))); // Rounding to avoid decimals in sale price? Usually 2 decimals.
      // Price.tsx used toFixed() which is integer string? Let's check Price.tsx usage.
      // Price.tsx: parseFloat(calculatedSalePrice.toFixed()) -> integer.
      // I will follow Price.tsx logic for consistency, but maybe 2 decimals is safer?
      // "parseFloat(calculatedSalePrice.toFixed())" produces integer.
    } else {
      setSalePrice(undefined);
    }
  };

  const handleApply = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const variations = getValues("variations") || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variations.forEach((_: any, index: number) => {
      if (regularPrice !== undefined && regularPrice > 0) {
        setValue(`variations.${index}.price.regularPrice`, regularPrice, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
      if (salePrice !== undefined && salePrice >= 0) {
        setValue(`variations.${index}.price.salePrice`, salePrice, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
      if (discountPercent !== undefined && discountPercent >= 0) {
        setValue(`variations.${index}.price.discountPercent`, discountPercent, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    });

    // Reset after apply
    setRegularPrice(undefined);
    setSalePrice(undefined);
    setDiscountPercent(undefined);
  };

  return (
    <div className="relative w-full">
      <SectionContentWrapper
        heading="Apply Same Price to Variations"
        collapse={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end p-2 !-mt-2">
          <div className="space-y-1">
            <Label className="text-xs text-gray-600">Price</Label>
            <Input
              type="number"
              placeholder="0.00"
              className="h-8 bg-white"
              value={regularPrice || ""}
              onChange={handleRegularChange}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-600">Sale Price</Label>
            <Input
              type="number"
              placeholder="0.00"
              className="h-8 bg-white"
              value={salePrice || ""}
              onChange={handleSaleChange}
              disabled={!regularPrice}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-600">Discount %</Label>
            <Input
              type="number"
              placeholder="0"
              className="h-8 bg-white"
              value={discountPercent || ""}
              onChange={handleDiscountChange}
              disabled={!regularPrice}
            />
          </div>
          <Button
            type="button"
            size="sm"
            className="h-8 w-full"
            onClick={handleApply}
            disabled={!regularPrice && !salePrice && !discountPercent}
          >
            Apply to All
          </Button>
        </div>
      </SectionContentWrapper>
    </div>
  );
};

export default SetBulkPrice;

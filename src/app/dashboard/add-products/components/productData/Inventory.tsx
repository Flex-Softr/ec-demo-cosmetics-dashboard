"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

type TProps = {
  isVariation?: boolean;
  prefix?: string; // e.g. "inventory" or "variations.0.inventory"
};

const Inventory = ({ isVariation, prefix = "inventory" }: TProps) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors, defaultValues },
  } = useFormContext();

  // Watch values for conditional rendering if needed
  const stockQuantity = watch(`${prefix}.stockQuantity`);
  const manageStock = watch(`${prefix}.manageStock`);
  const stockAvailable = watch(`${prefix}.stockAvailable`);
  const lowStockWarning = watch(`${prefix}.lowStockWarning`);
  const stockStatus = watch(`${prefix}.stockStatus`);

  const rootProductType = watch("type");
  const effectiveProductType = isVariation ? "variable" : rootProductType;
  const isSkuRequired = isVariation || effectiveProductType === "simple";

  // Error helper
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

  // Helper to get value from nested object (for defaultValues)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getValue = (fieldName: string, obj: any) => {
    const path = fieldName.split(".");
    let current = obj;
    for (const p of path) {
      if (current?.[p] !== undefined) {
        current = current[p];
      } else {
        return undefined;
      }
    }
    return current;
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <Label className="flex gap-3 w-48" htmlFor={`${prefix}.stockStatus`}>
          Stock Status
          <span title="Indicates whether the product is in stock, out of stock.">
            <i className="fa-solid fa-circle-question">i</i>
          </span>
        </Label>
        <div className="space-y-2 w-full">
          <select
            {...register(`${prefix}.stockStatus`)}
            id={`${prefix}.stockStatus`}
            className={`w-full h-9 border border-primary outline-primary rounded-md ${stockStatus === "In stock" ? "text-green-500" : "text-red-500"}`}
          >
            <option value="In stock" className="text-black">
              In stock
            </option>
            <option value="Out of stock" className="text-black">
              Out of stock
            </option>
          </select>
          {getError(`${prefix}.stockStatus`) && (
            <p className="text-red-600">{getError(`${prefix}.stockStatus`)}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <Label className="flex gap-3 w-48" htmlFor={`${prefix}.stockQuantity`}>
          Stock Quantity
          <span title="The total number of units.">
            <i className="fa-solid fa-circle-question">i</i>
          </span>
        </Label>
        <div className="space-y-2 w-full">
          <Input
            type="number"
            min={0}
            {...register(`${prefix}.stockQuantity`, {
              valueAsNumber: true,
              onChange: (e) => {
                const val = parseFloat(e.target.value);
                setValue(
                  `${prefix}.stockQuantity`,
                  isNaN(val) ? undefined : val
                );

                // Sync stockAvailable
                // Calculate 'sold' items from defaults: initialQuantity - initialAvailable
                const initialQuantity =
                  Number(getValue(`${prefix}.stockQuantity`, defaultValues)) ||
                  0;
                const initialAvailable =
                  Number(getValue(`${prefix}.stockAvailable`, defaultValues)) ||
                  0;
                const soldCount = Math.max(
                  0,
                  initialQuantity - initialAvailable
                );

                // New available = New Quantity - Sold Count
                // If it's a new product (no defaults), soldCount is 0, so Available === Quantity
                const newAvailable = isNaN(val)
                  ? undefined
                  : Math.max(0, val - soldCount);

                setValue(`${prefix}.stockAvailable`, newAvailable);
              },
            })}
            id={`${prefix}.stockQuantity`}
            placeholder="Enter stock quantity"
            className="w-full"
          />
          {getError(`${prefix}.stockQuantity`) && (
            <p className="text-red-600">
              {getError(`${prefix}.stockQuantity`)}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <Label className="flex gap-3 w-48" htmlFor={`${prefix}.stockAvailable`}>
          Stock Available
          <span title="The current number of units available for sale. This value decreases as orders are placed.">
            <i className="fa-solid fa-circle-question">i</i>
          </span>
        </Label>
        <div className="space-y-2 w-full">
          <Input
            type="number"
            min={0}
            {...register(`${prefix}.stockAvailable`, {
              valueAsNumber: true,
              onChange: (e) => {
                const val = parseFloat(e.target.value);
                setValue(
                  `${prefix}.stockAvailable`,
                  isNaN(val) ? undefined : val
                );
              },
            })}
            id={`${prefix}.stockAvailable`}
            disabled // Typically calculated/read-only?
            className={`w-full text-blue-700 ${stockAvailable <= (lowStockWarning || 0) ? "text-red-700" : ""} font-bold !opacity-100`}
          />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <Label className="flex gap-3 w-48" htmlFor={`${prefix}.sku`}>
          SKU
          {isSkuRequired && <span className="text-red-500">*</span>}
          <span title="A unique identifier for the product.">
            <i className="fa-solid fa-circle-question">i</i>
          </span>
        </Label>
        <div className="space-y-2 w-full">
          <Input
            type="text"
            {...register(`${prefix}.sku`)}
            id={`${prefix}.sku`}
            placeholder="Enter SKU"
            className="w-full"
          />
          {getError(`${prefix}.sku`) && (
            <p className="text-red-600">{getError(`${prefix}.sku`)}</p>
          )}
        </div>
      </div>

      {stockQuantity !== undefined && Number(stockQuantity) > 0 && (
        <div className="flex items-center gap-3 mb-3">
          <Label className="flex gap-3 w-48" htmlFor={`${prefix}.manageStock`}>
            Manage Stock
            <span title="Enable this to track and manage stock levels for this product by email.">
              <i className="fa-solid fa-circle-question">i</i>
            </span>
          </Label>
          <div className="space-y-2">
            <Input
              type="checkbox"
              {...register(`${prefix}.manageStock`)}
              id={`${prefix}.manageStock`}
            />
          </div>
        </div>
      )}
      {manageStock && (
        <div className="flex items-center gap-3 mb-3">
          <Label
            className="flex gap-3 w-48"
            htmlFor={`${prefix}.lowStockWarning`}
          >
            Low Stock Warning
            <span title="Set a threshold to receive email when stock levels fall below this number.">
              <i className="fa-solid fa-circle-question">i</i>
            </span>
          </Label>
          <div className="space-y-2 w-full">
            <Input
              type="number"
              min={0}
              {...register(`${prefix}.lowStockWarning`, {
                valueAsNumber: true,
                onChange: (e) => {
                  const val = parseFloat(e.target.value);
                  setValue(
                    `${prefix}.lowStockWarning`,
                    isNaN(val) ? undefined : val
                  );
                },
              })}
              id={`${prefix}.lowStockWarning`}
              placeholder="Enter low stock warning quantity"
              className="w-full"
            />
            {getError(`${prefix}.lowStockWarning`) && (
              <p className="text-red-600">
                {getError(`${prefix}.lowStockWarning`)}
              </p>
            )}
          </div>
        </div>
      )}
      {stockQuantity !== undefined && Number(stockQuantity) > 0 && (
        <div className="flex items-center gap-3 mb-3">
          <Label className="flex gap-3 w-48" htmlFor={`${prefix}.hideStock`}>
            Hide stock
            <span title="Enable this to hide the stock quantity from customers on the front end.">
              <i className="fa-solid fa-circle-question">i</i>
            </span>
          </Label>
          <div className="space-y-2">
            <Input
              type="checkbox"
              {...register(`${prefix}.hideStock`)}
              id={`${prefix}.hideStock`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

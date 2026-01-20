import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { stockStatusOptions } from "@/const/products";
import { getStockStatusColor } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

// ... (skipping unchanged parts) ...

type TProps = {
  isVariation?: boolean;
  prefix?: string; // e.g. "inventory" or "variations.0.inventory"
};

const Inventory = ({ prefix = "inventory" }: TProps) => {
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

  // const rootProductType = watch("type");
  // const effectiveProductType = isVariation
  //   ? PRODUCT_TYPE.VARIABLE
  //   : rootProductType;
  const isSkuRequired = false;

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
  // Helper to determine if we are in edit mode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getValue = (fieldName: string, obj: any) => {
    if (!obj) return undefined;
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

  const isEditMode = (() => {
    if (prefix === "inventory") {
      return !!defaultValues?._id;
    } else if (prefix.includes("variations")) {
      // prefix is like "variations.0.inventory"
      // we need to check "variations.0._id"
      const variationPath = prefix.replace(".inventory", "._id");
      return !!getValue(variationPath, defaultValues);
    }
    return false;
  })();

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* SKU - Moved to First Order */}
      <div className="space-y-2">
        <Label
          className="flex gap-2 cursor-help"
          htmlFor={`${prefix}.sku`}
          title="A unique identifier for the product."
        >
          SKU
          {isSkuRequired && <span className="text-red-500">*</span>}
        </Label>
        <div className="w-full">
          <Input
            type="text"
            {...register(`${prefix}.sku`)}
            id={`${prefix}.sku`}
            placeholder="Enter SKU"
            className="w-full"
          />
          {getError(`${prefix}.sku`) && (
            <p className="text-red-600 text-sm mt-1">
              {getError(`${prefix}.sku`)}
            </p>
          )}
        </div>
      </div>

      {/* Stock Status */}
      <div className="space-y-2">
        <Label
          className="flex gap-2 cursor-help"
          htmlFor={`${prefix}.stockStatus`}
          title="Indicates whether the product is in stock, out of stock."
        >
          Stock Status
        </Label>
        <div className="w-full">
          <select
            {...register(`${prefix}.stockStatus`)}
            id={`${prefix}.stockStatus`}
            className={`w-full h-9 border border-primary outline-primary rounded-md px-2 ${getStockStatusColor(
              stockStatus
            )}`}
          >
            {stockStatusOptions.map((status) => (
              <option
                key={status.value}
                value={status.value}
                className="text-black"
              >
                {status.label}
              </option>
            ))}
          </select>
          {getError(`${prefix}.stockStatus`) && (
            <p className="text-red-600 text-sm mt-1">
              {getError(`${prefix}.stockStatus`)}
            </p>
          )}
        </div>
      </div>

      {/* Stock Quantity */}
      <div className="space-y-2">
        <Label
          className="flex gap-2 cursor-help"
          htmlFor={`${prefix}.stockQuantity`}
          title="The total number of units."
        >
          Stock Quantity
        </Label>
        <div className="w-full">
          <Input
            type="number"
            min={0}
            disabled={isEditMode}
            {...register(`${prefix}.stockQuantity`, {
              valueAsNumber: true,
              onChange: (e) => {
                // Only sync available stock if NOT in edit mode
                if (!isEditMode) {
                  const val = parseFloat(e.target.value);
                  setValue(
                    `${prefix}.stockQuantity`,
                    isNaN(val) ? undefined : val
                  );
                  setValue(
                    `${prefix}.stockAvailable`,
                    isNaN(val) ? undefined : val
                  );
                }
              },
            })}
            id={`${prefix}.stockQuantity`}
            placeholder="Enter quantity"
            className="w-full disabled:opacity-60 disabled:bg-gray-100"
          />
          {getError(`${prefix}.stockQuantity`) && (
            <p className="text-red-600 text-sm mt-1">
              {getError(`${prefix}.stockQuantity`)}
            </p>
          )}
        </div>
      </div>

      {/* Stock Available */}
      <div className="space-y-2">
        <Label
          className="flex gap-2 cursor-help"
          htmlFor={`${prefix}.stockAvailable`}
          title="The current number of units available for sale."
        >
          Stock Available
        </Label>
        <div className="w-full">
          <Input
            type="number"
            min={0}
            disabled={!isEditMode}
            {...register(`${prefix}.stockAvailable`, {
              valueAsNumber: true,
              onChange: (e) => {
                const val = parseFloat(e.target.value);
                setValue(
                  `${prefix}.stockAvailable`,
                  isNaN(val) ? undefined : val
                );

                if (isEditMode) {
                  // In edit mode, updating available stock should update total quantity
                  // Total Quantity = New Available + (Original Quantity - Original Available)
                  // Sold Count = Original Quantity - Original Available

                  const initialQuantity =
                    Number(
                      getValue(`${prefix}.stockQuantity`, defaultValues)
                    ) || 0;
                  const initialAvailable =
                    Number(
                      getValue(`${prefix}.stockAvailable`, defaultValues)
                    ) || 0;

                  const soldCount = Math.max(
                    0,
                    initialQuantity - initialAvailable
                  );

                  const newQuantity = isNaN(val)
                    ? undefined
                    : Math.max(0, val + soldCount);

                  setValue(`${prefix}.stockQuantity`, newQuantity);
                }
              },
            })}
            id={`${prefix}.stockAvailable`}
            className={`w-full text-blue-700 ${
              stockAvailable <= (lowStockWarning || 0) ? "text-red-700" : ""
            } font-bold !opacity-100 disabled:opacity-60 disabled:bg-gray-100`}
          />
        </div>
      </div>

      {/* Checkboxes: Hide Stock (Left) & Manage Stock (Right) */}
      {stockQuantity !== undefined && Number(stockQuantity) > 0 && (
        <>
          {/* Hide Stock */}
          <div className="flex items-center space-x-2 py-1">
            <Input
              type="checkbox"
              {...register(`${prefix}.hideStock`)}
              id={`${prefix}.hideStock`}
              className="w-4 h-4 cursor-pointer"
            />
            <Label
              className="cursor-help"
              htmlFor={`${prefix}.hideStock`}
              title="Enable this to hide the stock quantity from customers."
            >
              Hide stock on customer
            </Label>
          </div>

          {/* Manage Stock */}
          <div className="flex items-center space-x-2 py-1">
            <Input
              type="checkbox"
              {...register(`${prefix}.manageStock`)}
              id={`${prefix}.manageStock`}
              className="w-4 h-4 cursor-pointer"
            />
            <Label
              className="cursor-help"
              htmlFor={`${prefix}.manageStock`}
              title="Enable this to track and update stock quantity for this product"
            >
              Manage Stock
            </Label>
          </div>
        </>
      )}

      {/* Low Stock Warning */}
      {manageStock && (
        <div className="col-span-2 space-y-2">
          <Label
            className="flex gap-2 cursor-help"
            htmlFor={`${prefix}.lowStockWarning`}
            title="Set a threshold to receive email when stock levels fall below this number."
          >
            Low Stock Warning
          </Label>
          <div className="w-full">
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
              <p className="text-red-600 text-sm mt-1">
                {getError(`${prefix}.lowStockWarning`)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

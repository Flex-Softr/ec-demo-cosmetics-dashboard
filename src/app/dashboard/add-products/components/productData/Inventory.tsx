"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setInventory } from "@/redux/features/addProduct/addProductSlice";
import { setVariationInventory } from "@/redux/features/addProduct/variation/variationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

type TProps = {
  isVariation?: boolean;
  index?: number;
  productId?: string;
};

const Inventory = ({ isVariation, index, productId }: TProps) => {
  const dispatch = useAppDispatch();
  const {
    sku,
    stockStatus,
    stockQuantity,
    stockAvailable,
    // productCode,
    manageStock,
    lowStockWarning,
    // showStockQuantity,
    // showStockWithText,
    // soldIndividually,
    hideStock,
  } = useAppSelector(({ addProduct, productVariation }) => {
    if (isVariation) {
      return productVariation.variations[index || 0]?.inventory || {};
    } else {
      return addProduct.inventory;
    }
  });

  const handleCheckedChange = (event: {
    target: { name: string; checked: boolean };
  }) => {
    const { name, checked } = event.target;
    dispatch(
      isVariation
        ? setVariationInventory({ index, [name]: checked })
        : setInventory({ [name]: checked })
    );
  };

  const handleChange = (e: { target: { name: string; value: unknown } }) => {
    const { name, value } = e.target;
    if (name === "stockQuantity" && value === "" && productId) {
      return;
    }
    dispatch(
      isVariation
        ? setVariationInventory({ index, [name]: value })
        : setInventory({ [name]: value })
    );
  };

  return (
    <div>
      {/* <form onChange={handleSubmit(onSubmit)}> */}
      <div className="flex items-center gap-3 mb-3">
        <Label className="flex gap-3 w-48" htmlFor="stockStatus">
          Stock Status
          <span title="Indicates whether the product is in stock, out of stock.">
            <i className="fa-solid fa-circle-question">i</i>
          </span>
        </Label>
        <div className="space-y-2 w-full">
          <select
            defaultValue={stockStatus}
            // {...register("stockStatus")}
            onChange={handleChange}
            name="stockStatus"
            id="stockStatus"
            className={`w-full h-9 border border-primary outline-primary rounded-md ${stockStatus === "In stock" ? "text-green-500" : "text-red-500"}`}
          >
            <option value="In stock" className="text-black">
              In stock
            </option>
            <option value="Out of stock" className="text-black">
              Out of stock
            </option>
            {/* <option value="On backorder">On backorder</option> */}
          </select>
          {/* {errors.stockStatus?.message && (
            <p className="text-red-600">{errors.stockStatus?.message}</p>
          )} */}
        </div>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <Label className="flex gap-3 w-48" htmlFor="stockQuantity">
          Stock Quantity
          <span title="The total number of units.">
            <i className="fa-solid fa-circle-question">i</i>
          </span>
        </Label>
        <div className="space-y-2 w-full">
          <Input
            type="number"
            defaultValue={stockQuantity || ""}
            // {...register("stockQuantity")}
            onChange={handleChange}
            name="stockQuantity"
            id="stockQuantity"
            placeholder="Enter stock quantity"
            className="w-full"
          />
          {/* {errors.stockQuantity?.message && (
            <p className="text-red-600">
              {errors.stockQuantity?.message as string}
            </p>
          )} */}
        </div>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <Label className="flex gap-3 w-48" htmlFor="stockAvailable">
          Stock Available
          <span title="The current number of units available for sale. This value decreases as orders are placed.">
            <i className="fa-solid fa-circle-question">i</i>
          </span>
        </Label>
        <div className="space-y-2 w-full">
          <Input
            type="number"
            defaultValue={stockAvailable || ""}
            // {...register("stockAvailable")}
            onChange={handleChange}
            name="stockAvailable"
            id="stockAvailable"
            // placeholder="Enter stock available"
            className={`w-full text-blue-700 ${stockAvailable <= lowStockWarning ? "text-red-700" : ""} font-bold !opacity-100`}
            disabled
          />
          {/* {errors.stockAvailable?.message && (
            <p className="text-red-600">
              {errors.stockAvailable?.message as string}
            </p>
          )} */}
        </div>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <Label className="flex gap-3 w-48" htmlFor="sku">
          SKU
          <span title="A unique identifier for the product.">
            <i className="fa-solid fa-circle-question">i</i>
          </span>
        </Label>
        <div className="space-y-2 w-full">
          <Input
            type="text"
            defaultValue={sku}
            // {...register("sku")}
            onChange={handleChange}
            name="sku"
            id="sku"
            placeholder="Enter SKU"
            className="w-full"
          />
          {/* {errors.sku?.message && (
            <p className="text-red-600">{errors.sku?.message as string}</p>
          )} */}
        </div>
      </div>
      {/* <div className="flex items-center gap-3 mb-3">
        <Label className="flex gap-3 w-48" htmlFor="productCode">
          Product Code
          <span title="Lorem Ipsum is simply dummy text.">
            <i className="fa-solid fa-circle-question">i</i>
          </span>
        </Label>
        <div className="space-y-2 w-full">
          <Input
            type="text"
            defaultValue={productCode}
            // {...register("productCode")}
            onChange={handleChange}
            name="productCode"
            id="productCode"
            placeholder="Enter product code"
            className="w-full"
          />
          {errors.productCode?.message && (
            <p className="text-red-600">
              {errors.productCode?.message as string}
            </p>
          )}
        </div>
      </div> */}
      {stockQuantity > 0 && (
        <div className="flex items-center gap-3 mb-3">
          <Label className="flex gap-3 w-48" htmlFor="manageStock">
            Manage Stock
            <span title="Enable this to track and manage stock levels for this product by email.">
              <i className="fa-solid fa-circle-question">i</i>
            </span>
          </Label>
          <div className="space-y-2">
            <Input
              type="checkbox"
              checked={manageStock}
              // {...register("manageStock")}
              onChange={handleCheckedChange}
              name="manageStock"
              id="manageStock"
            />
          </div>
        </div>
      )}
      {manageStock && (
        <div className="flex items-center gap-3 mb-3">
          <Label className="flex gap-3 w-48" htmlFor="lowStockWarning">
            Low Stock Warning
            <span title="Set a threshold to receive email when stock levels fall below this number.">
              <i className="fa-solid fa-circle-question">i</i>
            </span>
          </Label>
          <div className="space-y-2 w-full">
            <Input
              type="number"
              defaultValue={lowStockWarning || ""}
              // {...register("lowStockWarning")}
              name="lowStockWarning"
              onChange={handleChange}
              id="lowStockWarning"
              placeholder="Enter low stock warning quantity"
              className="w-full"
            />
            {/* {errors.lowStockWarning?.message && (
               <p className="text-red-600">
                 {errors.lowStockWarning?.message}
               </p>
             )} */}
          </div>
        </div>
      )}
      {stockQuantity > 0 && (
        <div className="flex items-center gap-3 mb-3">
          <Label className="flex gap-3 w-48" htmlFor="hideStock">
            Hide stock
            <span title="Enable this to hide the stock quantity from customers on the front end.">
              <i className="fa-solid fa-circle-question">i</i>
            </span>
          </Label>
          <div className="space-y-2">
            <Input
              type="checkbox"
              // {...register("hideStock")}
              defaultChecked={hideStock}
              onChange={handleCheckedChange}
              name="hideStock"
              id="hideStock"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

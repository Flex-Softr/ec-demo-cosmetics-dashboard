"use client";
import { useGetCustomerProductsQuery } from "@/redux/features/allProducts/allProductsApi";
import VariationOptions from "./VariationOptions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TFormInput } from "./CreateOrder";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from "react-hook-form";

type TProps = {
  control: Control<TFormInput>;
  register: UseFormRegister<TFormInput>;
  errors: FieldErrors<TFormInput>;
};

const SelectProduct = ({ control, register, errors }: TProps) => {
  const { data, isLoading } = useGetCustomerProductsQuery({
    page: 1,
    limit: 1000,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "orderedProducts",
  });

  // 👇 Prevent append from running multiple times
  const hasAppended = useRef(false);

  useEffect(() => {
    if (!hasAppended.current && fields.length === 0) {
      append({ product: "", quantity: 1, variation: "" });
      hasAppended.current = true;
    }
  }, [append, fields.length]);

  return (
    <div className="flex gap-5">
      <div className="space-y-5 w-full">
        {fields.map((field, index) => {
          return (
            <div key={field.id} className="space-y-2">
              <div className="grid grid-cols-4 gap-5">
                <div className="flex flex-col col-span-3 gap-2">
                  <Label htmlFor={`product-${index}`}>
                    Product name <span className="text-red-600">*</span>
                  </Label>
                  <select
                    {...register(`orderedProducts.${index}.product`)}
                    id={`product-${index}`}
                    className="w-full h-9 border border-primary outline-primary rounded-md"
                  >
                    <option value="">-- Select Product --</option>
                    {!isLoading &&
                      Array.isArray(data?.data) &&
                      data.data.map(
                        ({ _id, title }: { _id: string; title: string }) => (
                          <option value={_id} key={_id}>
                            {title}
                          </option>
                        )
                      )}
                  </select>
                  {errors.orderedProducts?.[index]?.product && (
                    <p className="text-red-600">
                      {errors.orderedProducts[index]?.product?.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 col-span-1">
                  <Label htmlFor={`quantity-${index}`}>
                    Product Quantity <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    defaultValue={1}
                    {...register(`orderedProducts.${index}.quantity`)}
                    id={`quantity-${index}`}
                    placeholder="Enter quantity"
                    className="w-full"
                  />
                  {errors.orderedProducts?.[index]?.quantity && (
                    <p className="text-red-600">
                      {errors.orderedProducts[index]?.quantity?.message}
                    </p>
                  )}
                </div>
              </div>
              <VariationOptions<TFormInput>
                index={index}
                control={control}
                register={register}
                product="product"
                orderedProducts="orderedProducts"
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-end gap-4 min-w-[188px]">
        <div
          onClick={() => append({ product: "", quantity: 1, variation: "" })}
          className="w-[140px] flex items-center gap-1 rounded-full text-sm font-medium transition-colors bg-primary hover:bg-secondary text-white shadow cursor-pointer h-9 px-2 py-2"
        >
          <Plus /> <span>Add Product</span>
        </div>

        {fields.length > 1 && (
          <span
            onClick={() => remove(fields.length - 1)}
            className="text-red-600 text-sm bg-white hover:bg-slate-100 p-1 mb-1 cursor-pointer"
          >
            <Trash2 />
          </span>
        )}
      </div>
    </div>
  );
};

export default SelectProduct;

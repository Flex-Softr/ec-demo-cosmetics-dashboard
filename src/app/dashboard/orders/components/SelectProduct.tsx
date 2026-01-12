"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetProductsQuery } from "@/redux/features/products/productsApi";
import { IAdminProduct } from "@/types/products";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  useFieldArray,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { TFormInput } from "./OrderForm";
import VariationOptions from "./VariationOptions";

type TProps = {
  control: Control<TFormInput>;
  register: UseFormRegister<TFormInput>;
  errors: FieldErrors<TFormInput>;
  setValue: UseFormSetValue<TFormInput>;
  clearErrors: UseFormClearErrors<TFormInput>;
};

const SelectProduct = ({
  control,
  register,
  errors,
  setValue,
  clearErrors,
}: TProps) => {
  const { data: products, isLoading } = useGetProductsQuery({
    limit: 0,
    status: "published",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "orderedProducts",
  });

  const watchedOrderedProducts = useWatch({
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
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow className="border-t">
            <TableHead className="w-[50%]">Product Name</TableHead>
            <TableHead className="w-[10%] text-center">Unit Price</TableHead>
            <TableHead className="w-[10%] text-center">Quantity</TableHead>
            <TableHead className="w-[15%] text-center">Amount</TableHead>
            <TableHead className="w-[10%] text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell className="align-top py-4">
                <div className="space-y-2">
                  <Controller
                    control={control}
                    name={`orderedProducts.${index}.product`}
                    render={({ field: { onChange, value, ...restField } }) => (
                      <select
                        {...restField}
                        value={value || ""}
                        onChange={onChange}
                        id={`product-${index}`}
                        className="w-full h-10 border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 rounded-md"
                      >
                        <option value="">Select Product...</option>
                        {!isLoading &&
                          Array.isArray(products?.data?.data) &&
                          products.data.data.map(
                            ({ _id, title }: IAdminProduct) => (
                              <option value={_id} key={_id}>
                                {title}
                              </option>
                            )
                          )}
                      </select>
                    )}
                  />
                  <VariationOptions<TFormInput>
                    index={index}
                    control={control}
                    register={register}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    product="product"
                    orderedProducts="orderedProducts"
                    selectedProduct={
                      Array.isArray(products?.data?.data)
                        ? products?.data?.data.find(
                            (p: IAdminProduct) =>
                              p._id === watchedOrderedProducts?.[index]?.product
                          )
                        : undefined
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    initialAttributes={(field as any).attributes}
                    availableVariations={
                      Array.isArray(products?.data?.data)
                        ? products?.data?.data.find(
                            (p: IAdminProduct) =>
                              p._id === watchedOrderedProducts?.[index]?.product
                          )?.variations
                        : undefined
                    }
                  />
                  {errors.orderedProducts?.[index]?.product && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.orderedProducts[index]?.product?.message}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="align-middle text-center py-4">
                <UnitPriceDisplay
                  control={control}
                  index={index}
                  products={products?.data?.data}
                />
              </TableCell>
              <TableCell className="align-middle py-4">
                <Input
                  type="number"
                  min={1}
                  {...register(`orderedProducts.${index}.quantity`)}
                  placeholder="1"
                  className="w-full h-10 text-center border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 rounded-md"
                />
                {errors.orderedProducts?.[index]?.quantity && (
                  <p className="text-red-500 text-xs mt-1 text-center">
                    {errors.orderedProducts[index]?.quantity?.message}
                  </p>
                )}
              </TableCell>

              <TableCell className="align-middle text-center py-4">
                <AmountDisplay
                  control={control}
                  index={index}
                  products={products?.data?.data}
                />
              </TableCell>

              <TableCell className="align-middle text-center py-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent h-10 w-10"
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-start">
        <Button
          type="button"
          onClick={() => append({ product: "", quantity: 1, variation: "" })}
          className="rounded-full text-sm font-medium"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Add More Product
        </Button>
      </div>
    </div>
  );
};

const UnitPriceDisplay = ({
  control,
  index,
  products,
}: {
  control: Control<TFormInput>;
  index: number;
  products: IAdminProduct[] | undefined;
}) => {
  const productId = useWatch({
    control,
    name: `orderedProducts.${index}.product` as "orderedProducts.0.product",
  });
  const variationId = useWatch({
    control,
    name: `orderedProducts.${index}.variation` as "orderedProducts.0.variation",
  });

  const price = useMemo(() => {
    if (!products || !productId) return 0;
    const product = products.find((p) => p._id === productId);
    if (!product) return 0;

    let unitPrice = product.salePrice || product.regularPrice || 0;
    if (variationId && product.variations) {
      const variation = product.variations.find((v) => v._id === variationId);
      if (variation && variation.price) {
        unitPrice =
          variation.price.salePrice ||
          variation.price.regularPrice ||
          unitPrice;
      }
    }
    return unitPrice;
  }, [productId, variationId, products]);

  return (
    <div className="h-10 flex items-center justify-center px-3 text-gray-700 font-medium whitespace-nowrap">
      &#2547; {price.toFixed(2)}
    </div>
  );
};

const AmountDisplay = ({
  control,
  index,
  products,
}: {
  control: Control<TFormInput>;
  index: number;
  products: IAdminProduct[] | undefined;
}) => {
  const quantity =
    useWatch({
      control,
      name: `orderedProducts.${index}.quantity` as "orderedProducts.0.quantity",
    }) || 0;

  const productId = useWatch({
    control,
    name: `orderedProducts.${index}.product` as "orderedProducts.0.product",
  });
  const variationId = useWatch({
    control,
    name: `orderedProducts.${index}.variation` as "orderedProducts.0.variation",
  });

  const price = useMemo(() => {
    if (!products || !productId) return 0;
    const product = products.find((p) => p._id === productId);
    if (!product) return 0;

    let unitPrice = product.salePrice || product.regularPrice || 0;
    if (variationId && product.variations) {
      const variation = product.variations.find((v) => v._id === variationId);
      if (variation && variation.price) {
        unitPrice =
          variation.price.salePrice ||
          variation.price.regularPrice ||
          unitPrice;
      }
    }
    return unitPrice;
  }, [productId, variationId, products]);

  return (
    <div className="h-10 flex items-center justify-center px-3 font-semibold whitespace-nowrap">
      &#2547; {(price * Number(quantity)).toFixed(2)}
    </div>
  );
};

export default SelectProduct;

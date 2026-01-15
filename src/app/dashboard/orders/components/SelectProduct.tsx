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
import { PRODUCT_STATUS } from "@/const/products";
import { useGetProductsQuery } from "@/redux/features/products/productsApi";
import { IAdminProduct } from "@/types/products";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import Select, { components, OptionProps } from "react-select";
import { TFormInput } from "./OrderForm";
import VariationOptions from "./VariationOptions";

type TProps = {
  control: Control<TFormInput>;
  register: UseFormRegister<TFormInput>;
  errors: FieldErrors<TFormInput>;
  setValue: UseFormSetValue<TFormInput>;
  clearErrors: UseFormClearErrors<TFormInput>;
};

// Custom Option Component for React-Select
type ProductOption = IAdminProduct & { label: string; value: string };

const CustomOption = (props: OptionProps<ProductOption>) => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-3 cursor-pointer">
        <div className="relative h-10 w-10 min-w-[40px] rounded overflow-hidden border">
          <Image
            src={data?.thumbnail?.src || "/placeholder.png"}
            alt={data?.title || "Product Image"}
            fill
            className="object-cover"
          />
        </div>
        <span className="text-sm font-medium">{data.label}</span>
      </div>
    </components.Option>
  );
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
    status: PRODUCT_STATUS.PUBLISHED,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "orderedProducts",
  });

  const watchedOrderedProducts = useWatch({
    control,
    name: "orderedProducts",
  });

  const productOptions = useMemo(() => {
    if (!products?.data?.data) return [];
    return products.data.data.map((product: IAdminProduct) => ({
      label: product.title,
      value: product._id,
      ...product,
    }));
  }, [products]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleProductSelect = (selectedOption: any) => {
    const option = selectedOption as ProductOption;
    if (option) {
      append({
        product: option.value,
        quantity: 1,
        variation: "",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Select Product Section */}
      <div className="w-full">
        <Select
          options={productOptions}
          onChange={handleProductSelect}
          value={null} // Keep it empty after selection
          placeholder="Search and Select Product..."
          isLoading={isLoading}
          components={{ Option: CustomOption }} // Use Custom Option
          className="basic-single"
          classNamePrefix="select"
          isClearable
          styles={{
            control: (base) => ({
              ...base,
              minHeight: "44px",
              borderColor: "#e2e8f0",
              boxShadow: "none",
              "&:hover": {
                borderColor: "#cbd5e1",
              },
            }),
          }}
        />
      </div>

      {/* Selected Products Table */}
      {fields.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className="border-t bg-blue-50/50">
              <TableHead className="w-[40%]">Product Name</TableHead>
              <TableHead className="w-[15%] text-center">Unit Price</TableHead>
              <TableHead className="w-[15%] text-center">Quantity</TableHead>
              <TableHead className="w-[15%] text-center">Amount</TableHead>
              <TableHead className="w-[15%] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => {
              // Find the product details for the current row
              const currentProductId = watchedOrderedProducts?.[index]?.product;
              const currentProduct = products?.data?.data?.find(
                (p: IAdminProduct) => p._id === currentProductId
              );

              return (
                <TableRow key={field.id} className="hover:bg-muted/10">
                  <TableCell className="align-middle py-4">
                    <div className="flex items-center gap-4">
                      {/* Product Image in Table */}
                      <div className="relative h-14 w-14 min-w-[56px] rounded-md border border-gray-200 overflow-hidden shadow-sm">
                        <Image
                          src={
                            currentProduct?.thumbnail?.src || "/placeholder.png"
                          }
                          alt={currentProduct?.title || "Product"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1 w-full">
                        <div className="font-semibold text-sm leading-tight text-gray-800">
                          {currentProduct?.title || "Product not found"}
                        </div>

                        <VariationOptions<TFormInput>
                          index={index}
                          control={control}
                          register={register}
                          setValue={setValue}
                          clearErrors={clearErrors}
                          product="product"
                          orderedProducts="orderedProducts"
                          selectedProduct={currentProduct}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          initialAttributes={(field as any).attributes}
                          availableVariations={currentProduct?.variations}
                        />
                        {errors.orderedProducts?.[index]?.product && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.orderedProducts[index]?.product?.message}
                          </p>
                        )}
                      </div>
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
                    <div className="flex justify-center">
                      <Input
                        type="number"
                        min={1}
                        {...register(`orderedProducts.${index}.quantity`)}
                        placeholder="1"
                        className="w-20 h-9 text-center border border-input bg-background px-2 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 rounded-md"
                      />
                    </div>
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
                      className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent h-9 w-9 rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
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

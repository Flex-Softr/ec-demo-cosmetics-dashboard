"use client";

import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useState } from "react";

import { useGetCustomerProductsQuery } from "@/redux/features/allProducts/allProductsApi";
import { TOrders } from "@/types/order/order.interface";
import { Trash2 } from "lucide-react";
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormClearErrors,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
  useWatch,
} from "react-hook-form";
import VariationOptions from "../../components/VariationOptions";
import { TEditOrderFormInput } from "./EditOrder";

type TProps = {
  addProduct: number[];
  setAddProduct: Dispatch<SetStateAction<number[]>>;
  existingSubTotal: number;
  order: TOrders;
  register: UseFormRegister<TEditOrderFormInput>;
  control: Control<TEditOrderFormInput>;
  watch: UseFormWatch<TEditOrderFormInput>;
  setValue?: UseFormSetValue<TEditOrderFormInput>;
  clearErrors?: UseFormClearErrors<TEditOrderFormInput>;
  reset?: UseFormReset<TEditOrderFormInput>;
  errors?: FieldErrors<TEditOrderFormInput>;
};

type TProduct = {
  _id: string;
  title: string;
  salePrice: number;
};

const AddProductToOrder = (props: TProps) => {
  const {
    addProduct,
    order,
    setAddProduct,
    register,
    control,
    setValue,
    clearErrors,
    existingSubTotal,
  } = props;
  // const [productsName, setProductsName] = useState<TProduct[]>([]);

  const [variations, setVariations] = useState<
    { _id: string; price: Record<string, unknown> }[]
  >([]);

  const { data } = useGetCustomerProductsQuery({
    page: 1,
    limit: 1000,
  });
  const productsName: TProduct[] = data?.data ?? [];

  const { remove } = useFieldArray({
    control,
    name: "productDetails",
  });

  // const selectedProductIds = useMemo(
  //   () => order?.products?.map((p) => p._id) || [],
  //   [order?.products]
  // );

  // useEffect(() => {
  //   if (products?.length > 0 ) {
  //     console.log("products", products);
  //     console.log("selectedProductIds", selectedProductIds);
  //     const filtered = products.filter(
  //       (item: TProduct) => !selectedProductIds.includes(item._id)
  //     );
  //     console.log("filteredProducts", filtered);
  //     setProductsName(filtered);
  //   }
  // }, [products, selectedProductIds]);

  const handleRemoveProduct = (index: number) => {
    const productIndex = [...addProduct];
    productIndex.pop();
    setAddProduct([...productIndex]);
    remove(index);
  };

  const watchedProducts = useWatch({ control, name: "productDetails" });
  const updatedDiscount = useWatch({ control, name: "discount" }) || 0;
  const updatedAdvance = useWatch({ control, name: "advance" }) || 0;

  const { shippingCharge, advance, discount, couponDiscount = 0 } = order || {};

  let updatedSubTotal = existingSubTotal;

  const totalMinus =
    Number(updatedDiscount || discount) + Number(updatedAdvance || advance);
  const shipping = Number(shippingCharge?.amount || 0);

  return (
    <>
      {addProduct.map((index) => {
        const productEntry = watchedProducts?.[index] || {};
        const { quantity = 1, newProductId, variation } = productEntry;

        const product = productsName.find((p) => p._id === newProductId);
        const variationPrice = variations.find((v) => v._id === variation)
          ?.price?.salePrice as number;

        const basePrice = product?.salePrice || 0;
        const unitPrice = variationPrice || basePrice;
        const updatedTotal = quantity * unitPrice;

        updatedSubTotal += updatedTotal;

        return (
          <tr
            key={index}
            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
          >
            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-normal break-words space-y-1">
              <select
                {...register(`productDetails.${index}.newProductId`)}
                className="h-9 border border-primary outline-primary focus:outline-none rounded max-w-[400px]"
                required
              >
                <option value="">Select product</option>
                {productsName.map(({ _id, title }) => (
                  <option key={_id} value={_id}>
                    {title}
                  </option>
                ))}
              </select>

              {newProductId && (
                <VariationOptions<TEditOrderFormInput>
                  index={index}
                  register={register}
                  control={control}
                  setValue={setValue!}
                  clearErrors={clearErrors!}
                  product="newProductId"
                  orderedProducts="productDetails"
                  variations={variations}
                  setVariations={setVariations}
                />
              )}
            </td>

            <td className="px-6 py-4 text-center whitespace-nowrap max-w-[80px]">
              {unitPrice}
            </td>

            <td className="px-6 py-4 w-14 text-center">
              <div className="space-y-2 w-14">
                <Input
                  type="number"
                  defaultValue={1}
                  min={1}
                  {...register(`productDetails.${index}.quantity`)}
                  className="w-full px-1 text-center"
                  required
                />
              </div>
            </td>

            <td className="px-6 py-4 text-center whitespace-nowrap max-w-[100px] relative">
              <span className="amount">{updatedTotal}</span>
              <button
                onClick={() => handleRemoveProduct(index)}
                type="button"
                title="Remove"
                className="text-red-600 absolute right-0 top-[35%] px-2"
              >
                <Trash2 size={20} />
              </button>
            </td>
          </tr>
        );
      })}

      <tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700 bg-blue-600">
        <td className="px-6 py-4" colSpan={5}>
          <div className="space-y-3">
            <p className="text-right">Sub Total : ৳ {updatedSubTotal}</p>

            {couponDiscount > 0 && (
              <p className="text-right">Coupon Discount : ৳ {couponDiscount}</p>
            )}

            <div className="flex items-center justify-end gap-2">
              <span>Discount</span>
              <Input
                type="number"
                defaultValue={discount}
                min={0}
                {...register("discount")}
                className="w-14 px-1 text-center"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <span>Advance</span>
              <Input
                type="number"
                defaultValue={advance}
                min={0}
                {...register("advance")}
                className="w-14 px-1 text-center"
              />
            </div>

            <p className="text-right">
              Shipping Cost : ৳ {shippingCharge?.amount || 0}
            </p>
            <hr />
            <p className="font-semibold text-right">
              Total : ৳{" "}
              {updatedSubTotal + shipping - totalMinus - couponDiscount}
            </p>
          </div>
        </td>
      </tr>
    </>
  );
};

export default AddProductToOrder;

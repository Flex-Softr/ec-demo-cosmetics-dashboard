"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
  useWatch,
} from "react-hook-form";

import { useToast } from "@/components/ui/use-toast";
import { useUpdateOrderMutation } from "@/redux/features/orders/ordersApi";
import { setIsOrderUpdate } from "@/redux/features/orders/ordersSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import WarrantyCodes from "@/app/dashboard/monitor-delivery/components/WarrantyCodes";
import AddProductToOrder from "./AddProductToOrder";

import { TOrders } from "@/types/order.interface";
import { refetchData } from "@/utilities/fetchData";
import { TEditOrderFormInput } from "./EditOrder";

type TEditOrderProps = {
  order: TOrders;
  register: UseFormRegister<TEditOrderFormInput>;
  control: Control<TEditOrderFormInput>;
  watch: UseFormWatch<TEditOrderFormInput>;
  setValue?: UseFormSetValue<TEditOrderFormInput>;
  clearErrors?: UseFormClearErrors<TEditOrderFormInput>;
  reset?: UseFormReset<TEditOrderFormInput>;
  errors?: FieldErrors<TEditOrderFormInput>;
};

const EditOrderTable = ({
  order,
  register,
  control,
  watch,
  setValue,
  clearErrors,
  reset,
}: TEditOrderProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { iSOrderUpdate } = useAppSelector((state) => state.orders);
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  const [addProduct, setAddProduct] = useState<number[]>([]);
  const { _id, products = [], deliveryStatus } = order || {};

  const handleAddProduct = () => {
    const lastIndex =
      addProduct.length > 0
        ? addProduct[addProduct.length - 1]
        : (products?.length ?? 0) - 1;
    setAddProduct((prev) => [...prev, lastIndex + 1]);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!_id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await updateOrder({
        _id,
        payload: { productDetails: [{ id, isDelete: true }] },
      }).unwrap();
      dispatch(setIsOrderUpdate(!iSOrderUpdate));
      await Promise.all([refetchData("allOrders"), refetchData("singleOrder")]);
      reset?.();
      toast({
        className: "bg-success text-white text-2xl",
        title: "Product deleted successfully!",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to delete the product! Something went wrong!",
      });
    }
  };

  const productDetails = useWatch({
    control,
    name: "productDetails",
  });

  const [existingSubTotal, setExistingSubTotal] = useState(0);

  useEffect(() => {
    const total =
      products?.reduce((sum, product, index) => {
        const qty =
          watch(`productDetails.${index}.quantity`) || product.quantity;
        const amount = product.unitPrice * qty;
        return sum + (product.isWarrantyClaim ? 0 : amount);
      }, 0) ?? 0;
    setExistingSubTotal(total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, watch, productDetails]);

  useEffect(() => {
    if (setValue) {
      // Set the product ID for each product in the form
      products?.forEach(({ _id, quantity }, index) => {
        // Set the value for productDetails[index].id
        setValue?.(`productDetails.${index}`, {
          id: _id,
          quantity: quantity,
        });
      });
    }
  }, [products, setValue]);

  return (
    <>
      {deliveryStatus !== "partial_delivered" && (
        <div className="mb-4 flex justify-start">
          <Button
            onClick={handleAddProduct}
            type="button"
            className="rounded-full font-medium"
          >
            <Plus className="mr-1" /> Add Product
          </Button>
        </div>
      )}

      <div className="relative shadow-md sm:rounded-lg">
        <table className="w-[720px] text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-white bg-primary dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">Product Name</th>
              {deliveryStatus === "partial_delivered" && (
                <th className="px-6 py-3 text-center w-[145px]">
                  Product Code
                </th>
              )}
              <th className="px-6 py-3 text-center w-[80px]">Price</th>
              <th className="px-6 py-3 text-center w-[80px]">Quantity</th>
              <th className="px-6 py-3 text-center w-[100px]">Amount</th>
            </tr>
          </thead>
          <tbody>
            {products?.map(
              (
                {
                  _id,
                  title,
                  unitPrice,
                  quantity,
                  isWarrantyClaim,
                  attributes = {},
                },
                index
              ) => {
                const variationProps = Object.keys(attributes)
                  .map((key) => attributes[key])
                  .join(" ");

                const qty =
                  watch(`productDetails.${index}.quantity`) ?? quantity;
                const amount = unitPrice * qty;

                return (
                  <tr
                    key={_id}
                    className={`border-b ${index % 2 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"} ${isWarrantyClaim ? "text-red-600" : ""}`}
                    title={isWarrantyClaim ? "Warranty product" : undefined}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-normal break-words">
                      {/* Hidden input to store product ID for form submission */}
                      {/* <input
                        type="text"
                        value={_id}
                        className="hidden"
                        {...register(`productDetails.${index}.id`)}
                      /> */}
                      {title}
                      {variationProps && (
                        <span className="italic font-semibold text-secondary">
                          {""} ({variationProps})
                        </span>
                      )}
                      {isWarrantyClaim && (
                        <span className="text-red-600 italic font-semibold">
                          {" "}
                          (Warranty)
                        </span>
                      )}
                    </td>

                    {deliveryStatus === "partial_delivered" && (
                      <td className="px-6 py-4">
                        <WarrantyCodes order={order} register={register} />
                      </td>
                    )}

                    <td className="px-6 py-4 text-center whitespace-nowrap max-w-[80px]">
                      {unitPrice}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap w-14">
                      <Input
                        type="number"
                        defaultValue={quantity}
                        min={deliveryStatus === "partial_delivered" ? 0 : 1}
                        {...register(`productDetails.${index}.quantity`)}
                        className="w-full px-1 text-center"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap max-w-[100px] relative">
                      <span>{amount}</span>
                      <button
                        type="button"
                        title="Delete"
                        disabled={isLoading}
                        onClick={() => handleDeleteProduct(_id)}
                        className="text-red-600 absolute right-0 top-[35%] px-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                );
              }
            )}

            <AddProductToOrder
              addProduct={addProduct}
              order={order}
              setAddProduct={setAddProduct}
              register={register}
              control={control}
              setValue={setValue}
              clearErrors={clearErrors}
              watch={watch}
              existingSubTotal={existingSubTotal}
            />
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EditOrderTable;

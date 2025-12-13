"use client";
import CommonModal from "@/components/modal/CommonModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { setIsOrderUpdate } from "@/redux/features/orders/ordersSlice";
import {
  useAddWarrantyCodeMutation,
  useUpdateWarrantyCodeMutation,
} from "@/redux/features/warranty/warrantySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TOrders } from "@/types/order/order.interface";
import { refetchData } from "@/utilities/fetchData";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  order_Id: yup.string().optional(),
  warrantyInfo: yup.array(
    yup.object().shape({
      itemId: yup
        .string()
        .required("Item is required!")
        .typeError("Item is required!"),
      codes: yup.array(
        yup.object().shape({
          code: yup
            .string()
            .required("Code is required!")
            .typeError("Code is required!"),
        })
      ),
    })
  ),
});

type TFormInput = yup.InferType<typeof schema>;
const ProductCode = ({
  order,
  disable,
}: {
  order: TOrders;
  disable: boolean;
}) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { iSOrderUpdate } = useAppSelector(
    ({ processingOrders }) => processingOrders
  );

  const [addWarrantyCode, { isLoading }] = useAddWarrantyCodeMutation();
  const [updateWarrantyCode, { isLoading: loading }] =
    useUpdateWarrantyCodeMutation();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
    reset();
  };

  const warranty = order.products?.find(({ warranty }) => {
    if (warranty?.warrantyCodes) {
      return true;
    }
  });

  const onSubmit: SubmitHandler<TFormInput> = async (data) => {
    try {
      data.order_Id = order._id;
      const res = await addWarrantyCode(data).unwrap();
      if (res.success) {
        await refetchData("processingOrders");
        dispatch(setIsOrderUpdate(!iSOrderUpdate));
        handleOpen();
        toast({
          className: "bg-success text-white text-2xl",
          title: "Product code added successfully!",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.data?.message,
      });
    }
  };
  const update: SubmitHandler<TFormInput> = async (data) => {
    try {
      const updatedData = {
        ...data,
        warrantyInfo: data?.warrantyInfo?.map((item) => ({
          ...item,
          codes: item?.codes?.filter((codeObj) => codeObj.code !== ""),
        })),
      };

      updatedData.order_Id = order._id;

      const res = await updateWarrantyCode(updatedData).unwrap();
      if (res.success) {
        // await refetchData("processingOrders");
        // dispatch(setIsOrderUpdate(!iSOrderUpdate));
        handleOpen();
        toast({
          className: "bg-success text-white text-2xl",
          title: `Product code updated successfully!`,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.data?.message,
      });
    }
  };

  return (
    <>
      {warranty ? (
        <Button
          onClick={handleOpen}
          type="button"
          className="bg-inherit text-inherit hover:bg-inherit"
        >
          View code
        </Button>
      ) : (
        <Button
          onClick={handleOpen}
          type="button"
          className="bg-inherit text-inherit hover:bg-inherit"
        >
          Add code
        </Button>
      )}

      <CommonModal
        open={open}
        handleOpen={handleOpen}
        modalTitle="Add product code"
        className="h-[400px] w-[500px]"
      >
        <p className="text-center border-b border-primary -my-3 pb-1">
          <strong>Order Id : </strong> {order?.orderId}
        </p>
        <div className="space-y-5">
          {order.products?.map(
            (
              { _id, title, quantity, isProductWarrantyAvailable, warranty },
              productIndex
            ) => {
              const totalCodes = warranty?.warrantyCodes?.length || 0;
              return (
                <div key={productIndex}>
                  <h1 className="text-lg">{title}</h1>
                  <p>
                    <strong>Quantity : </strong> <span>{quantity}</span>
                  </p>
                  {isProductWarrantyAvailable ? (
                    <>
                      <input
                        type="text"
                        defaultValue={_id}
                        {...register(`warrantyInfo.${productIndex}.itemId`)}
                        className="hidden"
                      />{" "}
                      <div className="grid grid-cols-2 gap-5 mt-2">
                        {Array.from({
                          length: totalCodes < quantity ? quantity : totalCodes,
                        }).map((_, index) => (
                          <div
                            className="space-y-2 flex-1"
                            key={`product-${productIndex}-quantity-${index}`}
                          >
                            <Label
                              htmlFor={`quantity-${productIndex}-${index}`}
                            >
                              Product {index + 1} code
                              <span className="text-red-600">*</span>
                            </Label>
                            <div className="space-y-2">
                              <Input
                                type="text"
                                {...register(
                                  `warrantyInfo.${productIndex}.codes.${index}.code`
                                )}
                                defaultValue={
                                  (warranty?.warrantyCodes?.length &&
                                    warranty?.warrantyCodes[index]?.code) ||
                                  ""
                                }
                                id={`quantity-${productIndex}-${index}`}
                                placeholder="Enter code"
                              />

                              {errors.warrantyInfo?.length &&
                                errors.warrantyInfo[productIndex]?.codes
                                  ?.length &&
                                errors?.warrantyInfo![productIndex]?.codes![
                                  index
                                ]?.code && (
                                  <p className="text-red-600">
                                    {
                                      errors?.warrantyInfo![productIndex]
                                        ?.codes![index]?.code?.message as string
                                    }
                                  </p>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p>This product has not warranty!</p>
                  )}
                </div>
              );
            }
          )}
          {!disable && (
            <div className="flex items-center justify-center mt-6">
              <Button
                onClick={handleSubmit(warranty ? update : onSubmit)}
                className="w-[200px]"
                disabled={isLoading || loading}
              >
                {warranty ? "Update" : "Save"}
              </Button>
            </div>
          )}
        </div>
      </CommonModal>
    </>
  );
};

export default ProductCode;

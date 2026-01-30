"use client";
import CommonModal from "@/components/modal/CommonModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { formatImageSrc } from "@/lib/utils";
import { setIsOrderUpdate } from "@/redux/features/orders/ordersSlice";
import {
  useAddWarrantyCodeMutation,
  useUpdateWarrantyCodeMutation,
} from "@/redux/features/warranty/warrantySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TOrders } from "@/types/order.interface";
import { refetchData } from "@/utilities/fetchData";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClipboardCopy } from "lucide-react";
import Image from "next/image";
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
    setValue,
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
      const payload = {
        ...data,
        order_Id: order._id,
        warrantyInfo: data.warrantyInfo?.filter((item) => item),
      };

      const res = await addWarrantyCode(payload).unwrap();
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
        warrantyInfo: data?.warrantyInfo
          ?.filter((item) => item)
          ?.map((item) => ({
            ...item,
            codes: item?.codes?.filter((codeObj) => codeObj.code !== ""),
          })),
      };

      updatedData.order_Id = order._id;

      const res = await updateWarrantyCode(updatedData).unwrap();
      if (res.success) {
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

  const handleSmartPaste = async (productIndex: number, maxCodes: number) => {
    try {
      const text = await navigator.clipboard.readText();
      const codes = text
        .split(/[\n,]+/) // Split by newline or comma
        .map((code) => code.trim())
        .filter((code) => code !== "");

      if (codes.length === 0) {
        toast({
          title: "No codes found in clipboard",
          description: "Please copy your warranty codes first!",
          variant: "destructive",
        });
        return;
      }

      const codesToPaste = codes.slice(0, maxCodes);
      codesToPaste.forEach((code, index) => {
        setValue(`warrantyInfo.${productIndex}.codes.${index}.code`, code, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      });

      toast({
        title: `Pasted ${codesToPaste.length} codes!`,
        className: "bg-success text-white",
      });
    } catch (error) {
      toast({
        title: "Failed to read clipboard",
        description: "Please allow clipboard access or try Ctrl+V",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {warranty ? (
        <Button
          onClick={handleOpen}
          type="button"
          className="bg-inherit text-inherit hover:bg-inherit w-24"
        >
          View code
        </Button>
      ) : (
        <Button
          onClick={handleOpen}
          type="button"
          className="bg-inherit text-inherit hover:bg-inherit w-24"
        >
          Add code
        </Button>
      )}

      <CommonModal
        open={open}
        handleOpen={handleOpen}
        modalTitle="Add Product Warranty Codes"
        className="max-h-[80vh] w-full max-w-4xl overflow-y-auto"
      >
        <div className="space-y-6 p-1">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-bold text-lg">{order?.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="font-bold text-lg">
                {order.products?.reduce((acc, curr) => acc + curr.quantity, 0)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {order.products?.map((product, productIndex) => {
              const {
                _id,
                title,
                quantity,
                isProductWarrantyAvailable,
                warranty,
                image,
                attributes,
              } = product;

              const totalCodes = warranty?.warrantyCodes?.length || 0;
              const requiredCodes =
                totalCodes < quantity ? quantity : totalCodes;

              const variationProps = attributes
                ? Object.entries(attributes)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")
                : "";

              return (
                <div
                  key={productIndex}
                  className={`rounded border shadow-sm ${
                    !isProductWarrantyAvailable
                      ? "bg-muted/10 opacity-70"
                      : "bg-card"
                  }`}
                >
                  <div className="flex items-start gap-3 p-3 border-b bg-muted/20">
                    <div className="relative h-10 w-10 overflow-hidden rounded border flex-shrink-0">
                      <Image
                        src={formatImageSrc(image?.src)}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-sm truncate leading-tight">
                          {title}
                        </h4>
                        {isProductWarrantyAvailable && !disable && (
                          <div
                            className="flex items-center"
                            title="Copy your codes first, then click here to paste them automatically"
                          >
                            <button
                              type="button"
                              className="flex items-center gap-1.5 h-6 px-2 text-xs text-muted-foreground hover:text-primary transition-colors bg-transparent border-none outline-none cursor-pointer"
                              onClick={() =>
                                handleSmartPaste(productIndex, requiredCodes)
                              }
                            >
                              <ClipboardCopy className="h-3 w-3" />
                              <span className="underline decoration-dotted underline-offset-2 font-medium">
                                Paste
                              </span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                        <span className="bg-primary/5 text-primary px-1.5 py-0.5 rounded font-medium">
                          Qty: {quantity}
                        </span>
                        {variationProps && <span>{variationProps}</span>}

                        {!isProductWarrantyAvailable && (
                          <span className="text-orange-600 font-medium flex items-center gap-1">
                            • No Warranty Available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isProductWarrantyAvailable ? (
                    <div className="p-3">
                      <input
                        type="text"
                        defaultValue={_id}
                        {...register(`warrantyInfo.${productIndex}.itemId`)}
                        className="hidden"
                      />

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {Array.from({ length: requiredCodes }).map(
                          (_, index) => (
                            <div
                              key={`product-${productIndex}-code-${index}`}
                              className="relative"
                            >
                              <Input
                                {...register(
                                  `warrantyInfo.${productIndex}.codes.${index}.code`
                                )}
                                defaultValue={
                                  (warranty?.warrantyCodes?.length &&
                                    warranty?.warrantyCodes[index]?.code) ||
                                  ""
                                }
                                placeholder={`Enter code #${index + 1}`}
                                className="h-8 text-xs font-mono disabled:opacity-100"
                                disabled={disable}
                              />
                              {errors.warrantyInfo?.[productIndex]?.codes?.[
                                index
                              ]?.code && (
                                <p className="text-[10px] text-red-500 mt-0.5 ml-1">
                                  {
                                    errors.warrantyInfo[productIndex]?.codes?.[
                                      index
                                    ]?.code?.message
                                  }
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2 bg-muted/5 text-center">
                      <p className="text-[11px] text-muted-foreground">
                        This product does not have warranty (non-warranty
                        product)
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!disable && (
            <div className="pt-6 flex justify-end gap-6">
              <Button
                variant="ghost"
                onClick={handleOpen}
                type="button"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit(warranty ? update : onSubmit)}
                className="min-w-[120px]"
                disabled={isLoading || loading}
              >
                {isLoading || loading
                  ? "Saving..."
                  : warranty
                    ? "Update Codes"
                    : "Save Codes"}
              </Button>
            </div>
          )}
        </div>
      </CommonModal>
    </>
  );
};

export default ProductCode;

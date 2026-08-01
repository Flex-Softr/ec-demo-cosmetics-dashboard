/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateOrderMutation,
  useUpdateOrderMutation,
} from "@/redux/features/orders/ordersApi";
import { setIsOrderUpdate } from "@/redux/features/orders/ordersSlice";
import { useGetPaymentMethodQuery } from "@/redux/features/paymentMethod/paymentMethodAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PRODUCT_TYPE } from "@/const/products";
import { TOrders } from "@/types/order.interface";
import { revalidateTag, TTags } from "@/utilities/revalidate";
import { useOrderCalculation } from "../hooks/useOrderCalculation";
import DivisionDistrictSelector from "./DivisionDistrictSelector";
import NameMobileAddress from "./NameMobileAddress";
import Notes from "./Notes";
import PaymentDiscountAdvance from "./PaymentDiscountAdvance";
import SelectProduct from "./SelectProduct";
import { ArrowLeft, ShoppingCart } from "lucide-react";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2.5 border-b border-border bg-muted px-5 py-3.5">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

const schema = yup.object().shape({
  shipping: yup.object().shape({
    fullName: yup.string().required("Customer name is required!"),
    phoneNumber: yup
      .string()
      .test("is-valid-phone", "Invalid phone number!", (value) =>
        value ? /^01[0-9]{9}$/.test(value.trim()) : true
      )
      .required("Phone number is required!"),
    email: yup.string().email("Invalid email format!").optional(),
    fullAddress: yup.string().required("Customer address is required!"),
    upazila: yup.string(),
    district: yup.string(),
    division: yup.string(),
  }),
  shippingCharge: yup.string().required("Shipping cost is required!"),
  payment: yup.object().shape({
    paymentMethod: yup.string().required("Payment is required!"),
    // paymentDetails: yup.record(yup.any()).optional(),
    paymentDetails: yup.object().optional(),
  }),
  advance: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0, "Advance must be a positive number")
    .optional(),
  discount: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0, "Discount must be a positive number")
    .optional(),
  couponDiscount: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0, "Coupon discount must be a positive number")
    .optional(),
  orderedProducts: yup.array(
    yup.object().shape({
      _id: yup.string().optional(),
      product: yup.string().required("Product name is required!"),
      quantity: yup
        .number()
        .min(1, "Stock quantity must be a positive number")
        .required("Stock quantity is required!")
        .typeError("Stock quantity is required!"),
      variation: yup.string().optional(),
      warrantyCodes: yup.array().optional(),
    })
  ),
  orderSource: yup.object().shape({
    name: yup.string().required("Order source is required!"),
  }),
  orderNotes: yup.string().default("").optional(),
  officialNotes: yup.string().default("").optional(),
  invoiceNotes: yup.string().default("").optional(),
  courierNotes: yup.string().default("").optional(),
  custom: yup.boolean().default(true),
  eventId: yup.string().default("eventId"),
});

export type TFormInput = yup.InferType<typeof schema>;

type OrderFormProps = {
  initialValues?: any;
  onSubmitSuccess?: () => void;
  imageToOrderId?: string;
  isEdit?: boolean;
  orderId?: string;
  deliveryStatus?: string;
  order?: TOrders;
};

const OrderForm: React.FC<OrderFormProps> = ({
  initialValues,
  onSubmitSuccess,
  imageToOrderId,
  isEdit,
  orderId,
  deliveryStatus,
  order,
}) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { iSOrderUpdate } = useAppSelector(({ orders }) => orders);
  const [createOrder, { isLoading: isCreateLoading }] =
    useCreateOrderMutation();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [updateOrder, { isLoading: isUpdateLoading }] =
    useUpdateOrderMutation();
  const isLoading = isCreateLoading || isUpdateLoading;

  const { data: paymentMethods } = useGetPaymentMethodQuery();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TFormInput>({
    resolver: yupResolver(schema) as any,
    defaultValues: initialValues,
  });

  const calculation = useOrderCalculation(control);

  const handleRevalidation = async () => {
    const productTags: TTags[] =
      order?.products?.flatMap((product: TOrders["products"][0]) => [
        `product-${product?.slug}` as TTags,
        `relatedProducts-${product?.slug}` as TTags,
        `collectionProducts-${product?.slug}` as TTags,
      ]) || [];

    await revalidateTag([
      ...productTags,
      "featuredProducts",
      "bestSellingProducts",
      "homepageIndividualSection",
    ]);
  };

  const onSubmit: SubmitHandler<TFormInput> = async (data) => {
    // Manual validation for dynamic payment fields
    const selectedMethodId = data.payment.paymentMethod;
    const selectedMethod = paymentMethods?.data?.find(
      (m: any) => m._id === selectedMethodId
    );

    if (selectedMethod && selectedMethod.required_inputs) {
      let hasError = false;
      selectedMethod.required_inputs.forEach((input: any) => {
        if (input.is_required) {
          const value = (
            data.payment?.paymentDetails as Record<string, unknown>
          )?.[input.name];
          if (!value || (typeof value === "string" && !value.trim())) {
            setError(`payment.paymentDetails.${input.name}` as any, {
              type: "manual",
              message: `${input.name} is required`,
            });
            hasError = true;
          }
        }
      });
      if (hasError) return;
    }

    // Validation for variable products
    let hasProductError = false;
    calculation.orderedProducts.forEach((product: any, index: number) => {
      if (product.type === PRODUCT_TYPE.VARIABLE && !product.variation) {
        setError(`orderedProducts.${index}.product` as any, {
          type: "manual",
          message: "Variation is required for variable product",
        });
        hasProductError = true;
      }
    });

    if (hasProductError) return;

    // Sanitize payment details based on selected method
    // This ensures we don't send stale data (e.g. transaction ID) if the user switched to COD
    const sanitizedPaymentDetails: Record<string, unknown> = {};
    if (selectedMethod?.required_inputs) {
      selectedMethod.required_inputs.forEach((input: any) => {
        const val = (data.payment?.paymentDetails as Record<string, unknown>)?.[
          input.name
        ];
        if (val !== undefined) {
          sanitizedPaymentDetails[input.name] = val;
        }
      });
    }
    // Update data with sanitized payment details
    if (data.payment) {
      data.payment.paymentDetails = sanitizedPaymentDetails;
    }

    try {
      if (isEdit && orderId) {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const payload: any = { ...data };

        // Sanitize warranty codes
        data?.orderedProducts?.forEach((product: any) => {
          if (product.warrantyCodes) {
            product.warrantyCodes = product.warrantyCodes.filter(
              (warranty: any) => warranty.code !== ""
            );
          }
        });

        // Construct orderedProducts payload according to API guide
        const currentProducts = data.orderedProducts || [];
        const originalProducts = initialValues?.orderedProducts || [];
        const payloadProducts: any[] = [];

        // 1. Handle Updates and Adds
        currentProducts.forEach((p: any) => {
          if (p._id) {
            // Existing item: Update
            payloadProducts.push({
              id: p._id,
              quantity: p.quantity,
              variation: p.variation,
              warrantyCodes: p.warrantyCodes,
            });
          } else {
            // New item: Add
            payloadProducts.push({
              product: p.product,
              variation: p.variation,
              quantity: p.quantity,
              warrantyCodes: p.warrantyCodes,
            });
          }
        });

        // 2. Handle Deletes
        originalProducts.forEach((p: any) => {
          if (p._id) {
            const exists = currentProducts.find((cp: any) => cp._id === p._id);
            if (!exists) {
              payloadProducts.push({
                id: p._id,
                isDelete: true,
              });
            }
          }
        });

        payload.orderedProducts = payloadProducts;

        if (deliveryStatus === "partial_delivered") {
          payload.status = "partial completed";
        }
        await updateOrder({ _id: orderId, payload }).unwrap();
        toast({
          className: "bg-success text-white text-2xl",
          title: "Order updated successfully!",
        });
        handleRevalidation();
      } else {
        const payload = imageToOrderId ? { ...data, id: imageToOrderId } : data;
        await createOrder(payload).unwrap();
        toast({
          className: "bg-success text-white text-2xl",
          title: "Order created successfully!",
        });
      }

      dispatch(setIsOrderUpdate(!iSOrderUpdate));

      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        router.push("/dashboard/orders");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="w-full space-y-5 p-4 sm:p-6 sm:pb-10">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9 rounded-lg border-border"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight text-foreground capitalize">
                {orderId ? `Edit Order #${order?.orderId}` : "Create Order"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {orderId
                  ? "Update customer, products, and payment details"
                  : "Place a new customer order"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form
        id="order-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <SectionCard title="Customer Information">
          <div className="space-y-3">
            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[1.2fr_0.8fr_1.5fr_2fr]">
              <NameMobileAddress
                register={register}
                reset={reset}
                control={control}
                shipping={initialValues?.shipping}
                errors={errors}
              />
            </div>
            <DivisionDistrictSelector<TFormInput>
              register={register}
              setValue={setValue}
              control={control}
              shipping={initialValues?.shipping}
              shippingCharge={initialValues?.shippingCharge}
              errors={errors}
            />
          </div>
        </SectionCard>

        <SectionCard title="Products & Payment">
          <div className="space-y-5">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                Product Selection
              </h3>
              <SelectProduct
                control={control}
                register={register}
                errors={errors}
                setValue={setValue}
                clearErrors={clearErrors}
              />
            </div>

            <Separator />

            <div className="flex flex-col gap-10 lg:flex-row">
              <div className="flex-1">
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Notes
                </h3>
                <Notes register={register} order={undefined} errors={errors} />
              </div>

              <div className="w-full space-y-4 lg:w-[400px]">
                <h3 className="text-sm font-semibold text-foreground">
                  Order Summary
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold">
                      &#2547; {Number(calculation.subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      &#2547; {Number(calculation.shippingCost).toFixed(2)} +{" "}
                      {calculation?.shippingCostExceptFirst}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="w-20 text-muted-foreground">Discount</span>
                    <div className="flex h-8 items-center gap-1 rounded-lg border border-border bg-card px-2">
                      <span>&#2547;</span>
                      <Input
                        type="number"
                        min={0}
                        {...register("discount")}
                        className="h-full w-20 border-none bg-transparent p-0 text-right shadow-none focus-visible:ring-0"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Coupon Discount
                    </span>
                    <div className="flex h-8 items-center gap-1 rounded-lg border border-border bg-card px-2">
                      <span>&#2547;</span>
                      <Input
                        type="number"
                        min={0}
                        {...register("couponDiscount")}
                        className="h-full w-20 border-none bg-transparent p-0 text-right shadow-none focus-visible:ring-0"
                        placeholder="0"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="w-20 text-muted-foreground">Advance</span>
                    <div className="flex h-8 items-center gap-1 rounded-lg border border-border bg-card px-2">
                      <span>&#2547;</span>
                      <Input
                        type="number"
                        min={0}
                        {...register("advance")}
                        className="h-full w-20 border-none bg-transparent p-0 text-right shadow-none focus-visible:ring-0"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="h-0.5" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>&#2547; {Number(calculation.total).toFixed(2)}</span>
                </div>

                <Separator className="h-0.5" />

                <div className="pt-2">
                  <PaymentDiscountAdvance
                    register={register}
                    payment={initialValues?.payment}
                    errors={errors}
                    watch={watch}
                    control={control}
                  />
                </div>

                <Button
                  type="submit"
                  form="order-form"
                  disabled={isLoading}
                  className="mt-2 w-full rounded-lg"
                  size="default"
                >
                  {isLoading
                    ? isEdit
                      ? "Updating..."
                      : "Placing..."
                    : isEdit
                      ? "Update Order"
                      : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        </SectionCard>
      </form>
    </div>
  );
};

export default OrderForm;

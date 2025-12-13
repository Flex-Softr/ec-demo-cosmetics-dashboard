"use client";
import CommonModal from "@/components/modal/CommonModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useGetCustomerProductsQuery } from "@/redux/features/allProducts/allProductsApi";
import { setIsOrderUpdate } from "@/redux/features/orders/ordersSlice";
import { useGetPaymentMethodQuery } from "@/redux/features/paymentMethod/paymentMethodAPI";
import { useGetShippingChargeQuery } from "@/redux/features/shippingCharge/shippingCharge";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { refetchData } from "@/utilities/fetchData";
import { yupResolver } from "@hookform/resolvers/yup";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import VariationOptions from "../../../../orders/components/VariationOptions";

const schema = yup.object().shape({
  shipping: yup.object().shape({
    fullName: yup.string().required("Customer name is required!"),
    phoneNumber: yup.string().required("Phone number is required!"),
    fullAddress: yup.string().required("Customer address is required!"),
  }),
  shippingCharge: yup.string().required("Shipping cost is required!"),
  payment: yup.object().shape({
    paymentMethod: yup.string().required("Payment is required!"),
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
  orderedProducts: yup.array(
    yup.object().shape({
      product: yup.string().required("Product name is required!"),
      quantity: yup
        .number()
        .min(1, "Stock quantity must be a positive number")
        .required("Stock quantity is required!")
        .typeError("Stock quantity is required!"),
      variation: yup.string().optional(),
    })
  ),
  orderSource: yup.object().shape({
    name: yup.string().required("Order source is required!"),
  }),
  // orderSource: yup.string().required("Order source is required!"),
  orderNotes: yup.string().optional(),
  officialNotes: yup.string().optional(),
  invoiceNotes: yup.string().optional(),
  courierNotes: yup.string().optional(),
  custom: yup.boolean().default(true),
  eventId: yup.string().default("eventId"),
});

type TFormInput = yup.InferType<typeof schema>;

import { useCreateNewOrderFromImageToOrderMutation } from "@/redux/features/imageToOrder/imageToOrderApi";
import { TImageToOrderReq } from "@/redux/features/imageToOrder/imageToOrderInterface";
import "react-image-gallery/styles/css/image-gallery.css";

const CreateNewOrder = ({ reqData }: { reqData: TImageToOrderReq }) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { iSOrderUpdate } = useAppSelector(({ orders }) => orders);
  const [createOrder, { isLoading }] =
    useCreateNewOrderFromImageToOrderMutation();
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(1);

  const { data: productsName } = useGetCustomerProductsQuery({});
  const { data: shippingCharges } = useGetShippingChargeQuery({});
  const { data: paymentMethods } = useGetPaymentMethodQuery({});

  const handleOpen = () => {
    setOpen(!open);
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { remove } = useFieldArray({
    control,
    name: "orderedProducts",
  });

  const onSubmit: SubmitHandler<TFormInput> = async (data) => {
    try {
      await createOrder({ ...data, id: reqData._id }).unwrap();
      dispatch(setIsOrderUpdate(!iSOrderUpdate));
      await refetchData("allOrders");
      reset();
      handleOpen();
      toast({
        className: "bg-success text-white text-2xl",
        title: "Order created successfully!",
      });
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
      <Button onClick={handleOpen} className="rounded-2xl">
        <Plus /> Create Order
      </Button>
      <CommonModal
        open={open}
        handleOpen={handleOpen}
        modalTitle="Create order"
        className="min-h-[550px] w-[950px]"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">
                Enter Customer Name <span className="text-red-600">*</span>
              </Label>
              <div className="space-y-2 w-full">
                <Input
                  type="text"
                  {...register("shipping.fullName")}
                  id="fullName"
                  placeholder="Enter Customer Name"
                  className="w-full"
                  defaultValue={reqData.shipping.fullName}
                />
                {errors.shipping?.fullName?.message && (
                  <p className="text-red-600">
                    {errors.shipping?.fullName?.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phoneNumber">
                Mobile No <span className="text-red-600">*</span>
              </Label>
              <div className="space-y-2 w-full">
                <Input
                  type="text"
                  {...register("shipping.phoneNumber")}
                  id="phoneNumber"
                  placeholder="Enter customer mobile number"
                  className="w-full"
                  defaultValue={reqData.shipping.phoneNumber}
                />
                {errors.shipping?.phoneNumber?.message && (
                  <p className="text-red-600">
                    {errors.shipping?.phoneNumber?.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullAddress">
                Full address <span className="text-red-600">*</span>
              </Label>
              <div className="space-y-2 w-full">
                <Input
                  type="text"
                  {...register("shipping.fullAddress")}
                  id="fullAddress"
                  placeholder="Enter customer full address"
                  className="w-full"
                  defaultValue={reqData.shipping.fullAddress}
                />
                {errors.shipping?.fullAddress?.message && (
                  <p className="text-red-600">
                    {errors.shipping?.fullAddress?.message as string}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-5">
            <div className="flex flex-col gap-2 mb-3">
              <Label htmlFor="cost">
                Shipping Cost <span className="text-red-600">*</span>
              </Label>
              <div className="space-y-2 w-full">
                <select
                  {...register("shippingCharge")}
                  className="w-full h-9 border border-primary outline-primary  rounded-sm"
                >
                  <option value="">Shipping charge</option>
                  {shippingCharges?.data?.map(
                    ({
                      _id,
                      name,
                      amount,
                    }: {
                      _id: string;
                      name: string;
                      amount: string;
                    }) => (
                      <option
                        key={_id}
                        value={_id}
                        className="flex items-center gap-5"
                      >
                        {name + " " + amount}
                      </option>
                    )
                  )}
                </select>
                {errors.shippingCharge?.message && (
                  <p className="text-red-600">
                    {errors.shippingCharge?.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <Label htmlFor="cost">
                Payment <span className="text-red-600">*</span>
              </Label>
              <div className="space-y-2 w-full">
                <select
                  {...register("payment.paymentMethod")}
                  className="w-full h-9 border border-gray-300  rounded-sm"
                >
                  <option value="">Payment</option>
                  {paymentMethods?.data?.map(
                    ({ _id, name }: { _id: string; name: string }) => (
                      <option
                        key={_id}
                        value={_id}
                        className="flex items-center gap-5"
                      >
                        {name}
                      </option>
                    )
                  )}
                </select>
                {errors.payment?.paymentMethod?.message && (
                  <p className="text-red-600">
                    {errors.payment?.paymentMethod?.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <Label htmlFor="cost">Discount</Label>
              <div className="space-y-2 w-full">
                <Input
                  type="number"
                  {...register("discount")}
                  id="cost"
                  placeholder="Enter discount"
                  className="w-full"
                />
                {errors.discount?.message && (
                  <p className="text-red-600">
                    {errors.discount?.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <Label htmlFor="cost">Advance</Label>
              <div className="space-y-2 w-full">
                <Input
                  type="number"
                  {...register("advance")}
                  id="cost"
                  placeholder="Enter advance"
                  className="w-full"
                />
                {errors.advance?.message && (
                  <p className="text-red-600">
                    {errors.advance?.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                Order Source <span className="text-red-600">*</span>
              </Label>
              <select
                {...register("orderSource.name")}
                className="w-full h-9 border border-gray-300  rounded-sm"
              >
                <option value="">Order source</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Social Media">Social Media</option>
                <option value="From Office">From Office</option>
                <option value="Others">Others</option>
              </select>
              {errors.orderSource?.name?.message && (
                <p className="text-red-600">
                  {errors.orderSource?.name?.message as string}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="space-y-5">
              {Array.from({ length: product }).map((_, index) => {
                const id = watch(`orderedProducts.${index}.product`);
                return (
                  <div className="space-y-2" key={index}>
                    <div className="grid grid-cols-3 gap-5">
                      <div className="flex flex-col col-span-2 gap-2">
                        <Label>
                          Product name <span className="text-red-600">*</span>
                        </Label>
                        <select
                          {...register(`orderedProducts.${index}.product`)}
                          className="w-full h-9 border border-gray-300  rounded-sm"
                        >
                          <option value="">Select product</option>
                          {productsName?.data?.map(
                            ({
                              _id,
                              title,
                            }: {
                              _id: string;
                              title: string;
                            }) => (
                              <option value={_id} key={_id}>
                                {title}
                              </option>
                            )
                          )}
                        </select>
                        {errors.orderedProducts &&
                          errors.orderedProducts[index] &&
                          errors.orderedProducts[index]?.product && (
                            <p className="text-red-600">
                              {errors.orderedProducts[index]?.product?.message}
                            </p>
                          )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="quantity">
                          Product Quantity{" "}
                          <span className="text-red-600">*</span>
                        </Label>
                        <div className="space-y-2 w-full">
                          <Input
                            type="number"
                            defaultValue={1}
                            min={1}
                            {...register(`orderedProducts.${index}.quantity`)}
                            id="quantity"
                            placeholder="Enter quantity"
                            className="w-full"
                          />
                          {errors.orderedProducts &&
                            errors.orderedProducts[index] &&
                            errors.orderedProducts[index]?.quantity && (
                              <p className="text-red-600">
                                {
                                  errors.orderedProducts[index]?.quantity
                                    ?.message
                                }
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                    {id && (
                      <VariationOptions<TFormInput>
                        index={index}
                        control={control}
                        product="newProductId"
                        register={register}
                        orderedProducts="orderedProducts"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex items-end gap-2">
              <div
                onClick={() => {
                  setProduct(product + 1);
                }}
                className="w-[140px] flex items-center gap-1 rounded-md text-sm font-medium transition-colors bg-primary hover:bg-secondary text-white  shadow cursor-pointer h-9 px-2 py-2"
              >
                <Plus /> <span>Add Product</span>
              </div>
              {product > 1 && (
                <span
                  onClick={() => {
                    remove(product - 1);
                    setProduct(product - 1);
                  }}
                  className="text-red-600 bg-white hover:bg-slate-100 h-9 px-2 py-2  cursor-pointer"
                >
                  <Minus />
                </span>
              )}
            </div>
          </div>
          <Tabs defaultValue="orderNote">
            <TabsList className="grid w-full grid-cols-3 gap-4 bg-cyan-50">
              <TabsTrigger
                value="orderNote"
                className="border border-cyan-400 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Official Note
              </TabsTrigger>
              <TabsTrigger
                value="invoiceNote"
                className="border border-cyan-400 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Invoice Note
              </TabsTrigger>
              <TabsTrigger
                value="courierNote"
                className="border border-cyan-400 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Courier Note
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orderNote">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="orderNote">Note</Label>
                <Textarea
                  placeholder="Type note here."
                  id="orderNote"
                  className="min-h-20 border border-primary focus-visible:ring-primary"
                  {...register("officialNotes")}
                />
              </div>
            </TabsContent>
            <TabsContent value="invoiceNote">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="invoiceNote">Note</Label>
                <Textarea
                  placeholder="Type note here."
                  id="invoiceNote"
                  className="min-h-20 border border-primary focus-visible:ring-primary"
                  {...register("invoiceNotes")}
                />
              </div>
            </TabsContent>
            <TabsContent value="courierNote">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="courierNote">Note</Label>
                <Textarea
                  placeholder="Type note here."
                  id="courierNote"
                  className="min-h-20 border border-primary focus-visible:ring-primary"
                  {...register("courierNotes")}
                />
              </div>
            </TabsContent>
            <div className="flex items-center justify-center mt-6">
              <Button type="submit" className="w-full" disabled={isLoading}>
                Create order
              </Button>
            </div>
          </Tabs>
        </form>
      </CommonModal>
    </>
  );
};

export default CreateNewOrder;

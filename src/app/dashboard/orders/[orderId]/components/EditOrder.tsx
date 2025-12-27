"use client";
import CommonModal from "@/components/modal/CommonModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateOrderMutation } from "@/redux/features/orders/ordersApi";
import { setIsOrderUpdate } from "@/redux/features/orders/ordersSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TOrders } from "@/types/order/order.interface";
import { refetchData } from "@/utilities/fetchData";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import DivisionDistrictSelector from "../../components/DivisionDistrictSelector";
import EditOrderTable from "./EditOrderTable";
import { dirtyValues } from "./utils";

const schema = yup.object().shape({
  shipping: yup.object().shape({
    fullName: yup.string().optional(),
    phoneNumber: yup.string().optional(),
    fullAddress: yup.string().optional(),
    upazila: yup.string().optional(),
    district: yup.string().optional(),
    division: yup.string().optional(),
  }),
  status: yup.string().optional(),
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
  productDetails: yup.array(
    yup.object().shape({
      id: yup.string().optional(),
      newProductId: yup.string().optional(),
      quantity: yup.number().optional(),
      variation: yup.string().optional(),
      warrantyCodes: yup.array(
        yup.object().shape({
          code: yup.string(),
        })
      ),
    })
  ),
  officialNotes: yup.string().trim().optional(),
  invoiceNotes: yup.string().trim().optional(),
  courierNotes: yup.string().trim().optional(),
});

export type TEditOrderFormInput = yup.InferType<typeof schema>;

const EditOrder = ({
  order,
  text,
  className,
  iconClassName,
}: {
  order: TOrders;
  text: string;
  className?: string;
  iconClassName?: string;
}) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { iSOrderUpdate } = useAppSelector(({ orders }) => orders);
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    clearErrors,
    formState: { dirtyFields },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleOpen = () => {
    reset();
    setOpen(!open);
  };

  const isFormDirty = Object.keys(dirtyFields).length > 0;

  const {
    _id,
    shipping,
    orderNotes,
    courierNotes,
    officialNotes,
    invoiceNotes,
  } = order;

  const onSubmit: SubmitHandler<TEditOrderFormInput> = async (data) => {
    try {
      const payload = dirtyValues(dirtyFields, data);

      if (order?.deliveryStatus === "partial_delivered") {
        payload.status = "partial completed";
        payload?.productDetails?.forEach((product) => {
          product.warrantyCodes = product?.warrantyCodes?.filter(
            (warranty) => warranty.code !== ""
          );
        });
        await updateOrder({ payload, _id }).unwrap();
      } else {
        await updateOrder({ payload, _id }).unwrap();
      }
      dispatch(setIsOrderUpdate(!iSOrderUpdate));
      await refetchData("allOrders");
      await refetchData("singleOrder");
      reset();
      handleOpen();
      toast({
        className: "bg-success text-white text-2xl",
        title: "Order edited successfully!",
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
      <Button
        onClick={(e) => {
          handleOpen();
          e.stopPropagation();
        }}
        className={className}
        title="Edit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={iconClassName}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
        <span>{text}</span>
      </Button>

      <CommonModal
        open={open}
        handleOpen={handleOpen}
        modalTitle="Edit order"
        className="w-[1000px]"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Customer Name</Label>
              <div className="space-y-2 w-full">
                <Input
                  type="text"
                  defaultValue={shipping?.fullName}
                  {...register("shipping.fullName")}
                  id="fullName"
                  placeholder="Enter Customer Name"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phoneNumber">Mobile No</Label>
              <div className="space-y-2 w-full">
                <Input
                  type="text"
                  defaultValue={shipping?.phoneNumber}
                  {...register("shipping.phoneNumber")}
                  id="phoneNumber"
                  placeholder="Enter customer mobile number"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullAddress">Full address</Label>
              <div className="space-y-2 w-full">
                <Input
                  type="text"
                  defaultValue={shipping?.fullAddress}
                  {...register("shipping.fullAddress")}
                  id="fullAddress"
                  placeholder="Enter customer full address"
                  className="w-full"
                />
              </div>
            </div>
          </div>
          {/* <LocationSelector  showDivision={false}/> */}
          <DivisionDistrictSelector<TEditOrderFormInput>
            register={register}
            setValue={setValue}
            control={control}
            shipping={shipping}
            shippingCharge={order?.shippingCharge}
            errors={{}}
            // showDivision={false}
          />
          <div className="flex gap-5 justify-between">
            <div>
              <EditOrderTable
                order={order}
                register={register}
                watch={watch}
                setValue={setValue}
                clearErrors={clearErrors}
                control={control}
                reset={reset}
              />
            </div>
            <div className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="orderNotes">Customer Note</Label>
                <Textarea
                  placeholder="Empty"
                  defaultValue={orderNotes}
                  className="min-h-20 min-w-24 border border-primary focus-visible:ring-primary"
                  disabled
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="officialNotes">Official Note</Label>
                <Textarea
                  placeholder="Type note here."
                  id="officialNotes"
                  className="min-h-20 min-w-24 border border-primary focus-visible:ring-primary"
                  {...register("officialNotes")}
                  defaultValue={officialNotes}
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="invoiceNote">Invoice Note</Label>
                <Textarea
                  placeholder="Type note here."
                  id="invoiceNote"
                  className="min-h-20 min-w-24 border border-primary focus-visible:ring-primary"
                  {...register("invoiceNotes")}
                  defaultValue={invoiceNotes}
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="courierNote">Courier Note</Label>
                <Textarea
                  placeholder="Type note here."
                  id="courierNote"
                  className="min-h-20 min-w-24 border border-primary focus-visible:ring-primary"
                  {...register("courierNotes")}
                  defaultValue={courierNotes}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end mt-6">
            <Button type="submit" disabled={!isFormDirty || isLoading}>
              Update order
            </Button>
          </div>
        </form>
      </CommonModal>
    </>
  );
};

export default EditOrder;

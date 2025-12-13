/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReset,
  useWatch,
} from "react-hook-form";
import { TFormInput } from "./CreateOrder";
import { useEffect, useState } from "react";
import fetchData from "@/utilities/fetchData";

type TProps = {
  shipping: TFormInput["shipping"] | undefined;
  register: UseFormRegister<TFormInput>;
  control: Control<TFormInput>;
  reset: UseFormReset<TFormInput>;
  errors: FieldErrors<TFormInput>;
};

const NameMobileAddress = (props: TProps) => {
  const { shipping, register, control, reset, errors } = props;

  const [loading, setLoading] = useState(false);

  // const phone = useWatch({
  //   control,
  //   name: "shipping.phoneNumber",
  // });

  // useEffect(() => {
  //   const isValidPhone = /^01[0-9]{9}$/.test(phone?.trim());
  //   const fetchOrderData = async () => {
  //     if (!shipping?.phoneNumber && isValidPhone) {
  //       setLoading(true);
  //       const { data } = await fetchData({
  //         endPoint: "/orders/admin/all-orders",
  //         cache: "no-store",
  //         searchParams: {
  //           search: phone,
  //         },
  //       });

  //       if (data?.data?.length > 0) {
  //         const existingOrder = data.data[0];
  //         reset({
  //           shipping: {
  //             fullName: existingOrder.shipping.fullName,
  //             fullAddress: existingOrder.shipping.fullAddress,
  //             district: existingOrder.shipping.district,
  //             division: existingOrder.shipping.division,
  //           },
  //           payment: {
  //             paymentMethod: existingOrder.payment.paymentMethod?._id,
  //           },
  //           shippingCharge: existingOrder.shippingCharge?._id,
  //         });
  //       } else {
  //         reset({
  //           shipping: {
  //             fullName: "",
  //             fullAddress: "",
  //             district: "",
  //             division: "",
  //           },
  //           payment: {
  //             paymentMethod: "",
  //           },
  //           shippingCharge: "",
  //         });
  //       }
  //       setLoading(false);
  //     }
  //   };
  //   fetchOrderData();
  // }, [phone, reset, shipping?.phoneNumber]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="fullName">
          Enter Customer Name <span className="text-red-600">*</span>
        </Label>
        <div className="space-y-2 w-full">
          <Input
            type="text"
            {...register("shipping.fullName")}
            id="fullName"
            placeholder={loading ? "Loading..." : "Enter Customer Name"}
            disabled={loading}
            className="w-full"
            defaultValue={shipping?.fullName}
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
            defaultValue={shipping?.phoneNumber}
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
            placeholder={loading ? "Loading..." : "Enter customer full address"}
            disabled={loading}
            className="w-full"
            defaultValue={shipping?.fullAddress}
          />
          {errors.shipping?.fullAddress?.message && (
            <p className="text-red-600">
              {errors.shipping?.fullAddress?.message as string}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default NameMobileAddress;

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import { TFormInput } from "./OrderForm";

type TProps = {
  shipping: TFormInput["shipping"] | undefined;
  register: UseFormRegister<TFormInput>;
  control: Control<TFormInput>;
  reset: UseFormReset<TFormInput>;
  errors: FieldErrors<TFormInput>;
};

const NameMobileAddress = (props: TProps) => {
  const { shipping, register, errors } = props;

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
            placeholder="Enter Customer Name"
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
            placeholder="Enter customer full address"
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

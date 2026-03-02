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
      {/* Name */}
      <div className="flex flex-col gap-1 min-w-0">
        <Label htmlFor="fullName" className="text-sm font-medium">
          Customer Name <span className="text-red-600">*</span>
        </Label>
        <Input
          type="text"
          {...register("shipping.fullName")}
          id="fullName"
          placeholder="Enter Customer Name"
          className="w-full"
          defaultValue={shipping?.fullName}
        />
        {errors.shipping?.fullName?.message && (
          <p className="text-red-600 text-xs">
            {errors.shipping.fullName.message as string}
          </p>
        )}
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-1 min-w-0">
        <Label htmlFor="phoneNumber" className="text-sm font-medium">
          Mobile No <span className="text-red-600">*</span>
        </Label>
        <Input
          type="text"
          {...register("shipping.phoneNumber")}
          id="phoneNumber"
          placeholder="Enter mobile number"
          className="w-full"
          defaultValue={shipping?.phoneNumber}
        />
        {errors.shipping?.phoneNumber?.message && (
          <p className="text-red-600 text-xs">
            {errors.shipping.phoneNumber.message as string}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1 min-w-0">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          type="email"
          {...register("shipping.email")}
          id="email"
          placeholder="Enter email"
          className="w-full"
          defaultValue={shipping?.email}
        />
        {errors.shipping?.email?.message && (
          <p className="text-red-600 text-xs">
            {errors.shipping.email.message as string}
          </p>
        )}
      </div>

      {/* Full Address */}
      <div className="flex flex-col gap-1 min-w-0">
        <Label htmlFor="fullAddress" className="text-sm font-medium">
          Full Address <span className="text-red-600">*</span>
        </Label>
        <Input
          type="text"
          {...register("shipping.fullAddress")}
          id="fullAddress"
          placeholder="Enter full address"
          className="w-full"
          defaultValue={shipping?.fullAddress}
        />
        {errors.shipping?.fullAddress?.message && (
          <p className="text-red-600 text-xs">
            {errors.shipping.fullAddress.message as string}
          </p>
        )}
      </div>
    </>
  );
};

export default NameMobileAddress;

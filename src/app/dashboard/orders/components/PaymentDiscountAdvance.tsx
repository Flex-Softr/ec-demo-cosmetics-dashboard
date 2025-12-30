/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetPaymentMethodQuery } from "@/redux/features/paymentMethod/paymentMethodAPI";
import { Payment } from "@/types/order.interface";
import { useMemo } from "react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import { TFormInput } from "./OrderForm";

type TProps = {
  payment: Payment | undefined;
  register: UseFormRegister<TFormInput>;
  errors: FieldErrors<TFormInput>;
  watch: UseFormWatch<TFormInput>;
  control: Control<TFormInput>;
};

const PaymentDiscountAdvance = (props: TProps) => {
  const { payment, register, errors, watch } = props;
  const { data: paymentMethods, isLoading } = useGetPaymentMethodQuery();

  const selectedMethodId = watch("payment.paymentMethod");

  const selectedMethod = useMemo(() => {
    return paymentMethods?.data?.find((m) => m._id === selectedMethodId);
  }, [selectedMethodId, paymentMethods]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2 mb-3">
          <Label htmlFor="cost">
            Payment <span className="text-red-600">*</span>
          </Label>
          <div className="space-y-2 w-full">
            {!isLoading && (
              <select
                {...register("payment.paymentMethod")}
                defaultValue={payment?.paymentMethod?._id}
                className="w-full h-9 border border-primary outline-primary  rounded-md"
              >
                <option value="">-- Select Payment --</option>
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
            )}

            {errors.payment?.paymentMethod?.message && (
              <p className="text-red-600">
                {String(errors.payment.paymentMethod.message)}
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
            className="w-full h-9 border border-primary outline-primary  rounded-md"
          >
            <option value="">-- Select Order Source --</option>
            <option value="Phone Call">Phone Call</option>
            <option value="Social Media">Social Media</option>
            <option value="From Office">From Office</option>
          </select>
          {errors.orderSource?.name?.message && (
            <p className="text-red-600">
              {errors.orderSource?.name?.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Dynamic Required Inputs */}
      {selectedMethod &&
        selectedMethod.required_inputs &&
        selectedMethod.required_inputs.length > 0 && (
          <div className="p-4 border rounded-md bg-gray-50 space-y-4">
            <h3 className="font-semibold text-sm">
              Additional Details for {selectedMethod.name}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {selectedMethod.required_inputs.map((input, idx) => (
                <div key={idx} className="space-y-2">
                  <Label>
                    {input.name}{" "}
                    {input.is_required && (
                      <span className="text-red-600">*</span>
                    )}
                  </Label>
                  {input.type === "select" ? (
                    <select
                      {...register(
                        `payment.paymentDetails.${input.name}` as any,
                        {
                          required: input.is_required
                            ? `${input.name} is required`
                            : false,
                        }
                      )}
                      className="w-full h-9 border border-gray-300 rounded-md px-2"
                    >
                      <option value="">Select {input.name}</option>
                      {input.enums?.split(",").map((opt) => (
                        <option key={opt.trim()} value={opt.trim()}>
                          {opt.trim()}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={input.type === "number" ? "number" : "text"}
                      {...register(
                        `payment.paymentDetails.${input.name}` as any,
                        {
                          required: input.is_required
                            ? `${input.name} is required`
                            : false,
                        }
                      )}
                      placeholder={`Enter ${input.name}`}
                    />
                  )}
                  {errors.payment?.paymentDetails &&
                    (errors.payment.paymentDetails as any)[input.name] && (
                      <p className="text-red-600 text-xs">
                        {
                          (errors.payment.paymentDetails as any)[input.name]
                            ?.message
                        }
                      </p>
                    )}
                </div>
              ))}
            </div>
            {selectedMethod.instructions && (
              <p className="text-xs text-gray-500 italic">
                Note: {selectedMethod.instructions}
              </p>
            )}
          </div>
        )}
    </div>
  );
};

export default PaymentDiscountAdvance;

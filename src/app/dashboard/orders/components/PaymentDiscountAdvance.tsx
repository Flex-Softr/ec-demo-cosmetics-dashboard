"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { TFormInput } from "./CreateOrder";
import { useGetPaymentMethodQuery } from "@/redux/features/paymentMethod/paymentMethodAPI";
import { Payment } from "@/types/order/order.interface";

type TProps = {
  payment: Payment | undefined;
  register: UseFormRegister<TFormInput>;
  errors: FieldErrors<TFormInput>;
};

const PaymentDiscountAdvance = (props: TProps) => {
  const { payment, register, errors } = props;
  const { data: paymentMethods, isLoading } = useGetPaymentMethodQuery({});

  return (
    <div className="grid grid-cols-4 gap-5">
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
            <p className="text-red-600">{errors.discount?.message as string}</p>
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
            <p className="text-red-600">{errors.advance?.message as string}</p>
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
  );
};

export default PaymentDiscountAdvance;

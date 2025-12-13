"use client";

import EcButton from "@/components/EcButton/EcButton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useCreateShippingChargeMutation } from "@/redux/features/shippingCharge/shippingCharge";
import {
  TErrorMessages,
  TErrorResponse,
  TSuccessResponse,
} from "@/types/response/response";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  amount: yup.number().required("Charge amount is required"),
});

export type TFormInput = yup.InferType<typeof schema>;

const CreateShippingForm = () => {
  const { toast } = useToast();
  const [serverErrors, setServerErrors] = useState<TErrorMessages[]>([]);

  const [createShippingCharge, { isLoading }] =
    useCreateShippingChargeMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormInput>({
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<TFormInput> = async (data) => {
    setServerErrors([]);
    try {
      const res = (await createShippingCharge(
        data
      ).unwrap()) as TSuccessResponse;
      if (res.success) {
        reset();
        toast({
          className: "toast-success",
          title: res?.message,
        });
      }
    } catch (error) {
      const err = (error as { data: TErrorResponse })?.data;
      setServerErrors(err?.errorMessages);
      toast({
        className: "toast-error",
        title: err?.message,
      });
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Input
            type="text"
            {...register("name")}
            id="name"
            placeholder="Enter shipping name"
            className="w-full border-gray-300"
          />
          {errors.name?.message && (
            <p className="text-red-600 font-bold text-sm">
              {errors.name?.message}
            </p>
          )}
        </div>
        <div>
          <Input
            type="number"
            {...register("amount")}
            id="amount"
            placeholder="Enter charge amount"
            className="w-full border-gray-300"
          />
          {errors.amount?.message && (
            <p className="text-red-600 font-bold text-sm">
              {errors.amount?.message}
            </p>
          )}
        </div>

        {serverErrors?.length ? (
          <div>
            <ul className="list-disc ml-5">
              {serverErrors.map((item, index) => (
                <li className="text-red-600 font-bold text-sm" key={index}>
                  {item.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <EcButton disabled={isLoading} loading={isLoading} type="submit">
          Create
        </EcButton>
      </form>
    </div>
  );
};

export default CreateShippingForm;

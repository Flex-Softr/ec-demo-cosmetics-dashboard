"use client";
import EcButton from "@/components/EcButton/EcButton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { TErrorMessages, TErrorResponse } from "@/types/response/response";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

const ChangePassword = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [serverMessage, setServerMessage] = useState<null | TErrorMessages[]>(
    null
  );

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setServerMessage(null);

    if (data.confirmPassword !== data.newPassword) {
      setServerMessage([
        {
          path: "",
          message: "New password and confirm password does not match",
        },
      ]);
      return;
    }
    try {
      const payload: FieldValues = data;

      const res = await changePassword(payload).unwrap();
      reset();
      toast({
        className: "bg-success text-white text-2xl",
        title: res.message,
      });
    } catch (error) {
      const err = (error as { data: TErrorResponse }).data;
      if (err.errorMessages.length) {
        setServerMessage(err.errorMessages);
      }
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-[450px]">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="previousPassword"
            >
              Current password
            </label>
            <Input
              className={`shadow appearance-none border ${errors.previousPassword ? "border-red-500" : "border-gray-200"} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              type="password"
              placeholder="Enter Your current password"
              id="previousPassword"
              {...register("previousPassword")}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="newPassword"
            >
              New password
            </label>
            <Input
              className={`shadow appearance-none border ${errors.newPassword ? "border-red-500" : "border-gray-200"} rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
              type="password"
              id="newPassword"
              placeholder="Enter new password"
              {...register("newPassword")}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm password
            </label>
            <Input
              className={`shadow appearance-none border ${errors.confirmPassword ? "border-red-500" : "border-gray-200"} rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
              type="password"
              id="confirmPassword"
              placeholder="Enter new password"
              {...register("confirmPassword")}
              required
            />
          </div>
          {serverMessage ? (
            <div className="ml-5 mb-6">
              <ul className="list-disc font-semibold text-red-600">
                {serverMessage.map(({ message }) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="flex flex-col items-center justify-between gap-5">
            <EcButton
              type="submit"
              disabled={isLoading}
              className="w-full  font-bold py-2 px-4 bg-primary"
            >
              Update password
            </EcButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

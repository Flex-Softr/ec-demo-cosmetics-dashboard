"use client";
import EcButton from "@/components/EcButton/EcButton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { TUser } from "@/redux/features/auth/interface";
import { useAppDispatch } from "@/redux/hooks";
import { TErrorMessages, TErrorResponse } from "@/types/response/response";
import decodeJWT from "@/utilities/decodeJWT";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [serverMessage, setServerMessage] = useState<null | TErrorMessages[]>(
    null
  );
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setServerMessage(null);
    try {
      const payload: FieldValues = {};
      for (const key in data) {
        if (key) {
          payload[key] = data[key]?.trim();
        }
      }
      const res = await login(payload).unwrap();
      const user = decodeJWT(res.data.accessToken) as TUser;
      dispatch(setUser({ user: user, token: res.data.accessToken }));
      toast({
        className: "bg-success text-white text-2xl",
        title: res.message,
      });
      router.push("/");
    } catch (error) {
      const err = (error as { data: TErrorResponse }).data;
      if (err.errorMessages.length) {
        setServerMessage(err.errorMessages);
      }
    }
  };

  return (
    <div className="flex justify-center h-screen items-center">
      <div className="w-[430px] border-none md:mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div>
            <h4 className="text-center my-3 font-bold  text-2xl">Login Page</h4>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phoneEmailOrUid"
            >
              Phone Number
            </label>
            <Input
              className={`shadow appearance-none border ${errors.phoneEmailOrUid ? "border-red-500" : "border-gray-200"} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              type="tel"
              placeholder="Enter Your Phone Number"
              id="phoneEmailOrUid"
              {...register("phoneEmailOrUid")}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              className={`shadow appearance-none border ${errors.password ? "border-red-500" : "border-gray-200"} rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
              type="password"
              id="password"
              placeholder="Enter a Password"
              {...register("password")}
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
              Login
            </EcButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

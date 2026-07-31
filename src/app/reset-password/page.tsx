"use client";
import EcButton from "@/components/EcButton/EcButton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import config from "@/config/config";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { TErrorResponse } from "@/types/response";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import * as yup from "yup";
import logo from "../../../public/logo.png";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be 6 digits")
    .matches(/^[0-9]+$/, "OTP must be numeric"),
  password: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
});

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const emailParam = searchParams.get("email") || "";

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: emailParam,
      otp: "",
      password: "",
    },
  });

  useEffect(() => {
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [emailParam, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.password,
      }).unwrap();

      if (res.success) {
        toast({
          className: "bg-success text-success-foreground border-none",
          title: "Success!",
          description: "Your password has been reset successfully.",
        });
        router.push(`${config.base_path}/login`);
      }
    } catch (error) {
      const err = (error as { data: TErrorResponse }).data;
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: err?.message || "Something went wrong.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl border border-slate-100 px-6 sm:px-8 py-8 sm:py-10">
        <div className="text-center mb-6 space-y-2">
          <div className="flex justify-center mb-4">
            <Image
              src={logo}
              alt="Logo"
              width={180}
              height={100}
              className="w-40 h-auto"
              priority
            />
          </div>

          <div className="flex justify-center mb-2 text-primary">
            <Lock size={48} />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Reset Password
          </h1>
          <p className="text-slate-500 text-sm">
            Please enter the OTP sent to your email and your new password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="h-12 px-4 bg-slate-100 border border-slate-200 text-slate-500 text-sm rounded-lg cursor-not-allowed"
                  disabled
                />
              )}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              OTP Code
            </label>
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter 6-digit OTP"
                  className={`h-12 px-4 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all ${errors.otp ? "border-red-500" : ""}`}
                />
              )}
            />
            {errors.otp && (
              <p className="text-xs text-red-500">{errors.otp.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              New Password
            </label>
            <div className="relative">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`h-12 px-4 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all pr-10 ${errors.password ? "border-red-500" : ""}`}
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="pt-2">
            <EcButton
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base font-bold rounded-lg transition-all shadow-md active:scale-[0.98] border-none"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Reset Password"
              )}
            </EcButton>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => router.push("/forget-password")}
              className="text-sm font-semibold text-slate-500 hover:text-primary transition-all flex items-center justify-center gap-2 w-full"
            >
              <ArrowLeft size={16} />
              Resend OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

"use client";
import EcButton from "@/components/EcButton/EcButton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { TUser } from "@/redux/features/auth/interface";
import { useAppDispatch } from "@/redux/hooks";
import { TErrorMessages, TErrorResponse } from "@/types/response";
import decodeJWT from "@/utilities/decodeJWT";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import logo from "../../../public/logo.png";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [serverMessage, setServerMessage] = useState<null | TErrorMessages[]>(
    null
  );
  const [showPassword, setShowPassword] = useState(false);
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
        className: "bg-emerald-500 text-white border-none",
        title: "Welcome Back!",
        description: res.message || "Logged in successfully.",
      });
      router.push("/");
    } catch (error) {
      const err = (error as { data: TErrorResponse }).data;
      if (err?.errorMessages?.length) {
        setServerMessage(err.errorMessages);
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: err?.message || "Something went wrong.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl border border-slate-100 px-6 sm:px-8 py-8 sm:py-10">
        <div className="text-center mb-6 space-y-2">
          <div className="flex justify-center mb-2">
            <Image
              src={logo}
              alt="Logo"
              width={180}
              height={100}
              className="w-40 h-auto"
              priority
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            সিদ্দীকিয়া প্রকাশনী
          </h1>
          <p className="text-slate-500 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Admin Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                className="text-sm font-semibold text-slate-700"
                htmlFor="phoneEmailOrUid"
              >
                Email or Phone
              </label>
              <Input
                className={`h-12 px-4 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm rounded-lg focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all ${errors.phoneEmailOrUid ? "border-red-500 ring-2 ring-red-500/10" : ""}`}
                placeholder="Enter your email or phone"
                id="phoneEmailOrUid"
                {...register("phoneEmailOrUid")}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="text-sm font-semibold text-slate-700"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  className={`h-12 px-4 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm rounded-lg focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all pr-10 ${errors.password ? "border-red-500 ring-2 ring-red-500/10" : ""}`}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  {...register("password")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push("/forget-password")}
                  className="text-xs font-semibold text-primary hover:underline transition-all"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>

          {serverMessage && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-3">
              <div className="flex gap-2">
                <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                <ul className="text-xs font-semibold text-red-600 space-y-1">
                  {serverMessage.map(({ message }) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="pt-2">
            <EcButton
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-base font-bold rounded-lg transition-all shadow-md active:scale-[0.98] border-none"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Log In"
              )}
            </EcButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

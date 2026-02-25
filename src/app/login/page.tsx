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
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Loader2, Lock, User } from "lucide-react";
import Image from "next/image";
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
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-slate-50">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-100/50 blur-[120px] rounded-full animate-pulse decoration-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[450px] px-6 py-12"
      >
        <div className="backdrop-blur-xl bg-white/70 border border-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden relative group">
          {/* Subtle line decoration */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

          <div className="text-center mb-10 space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="flex justify-center mb-6"
            >
              <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="w-20 h-12"
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-extrabold text-slate-900 tracking-tight"
            >
              Nora Life Style
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-500 font-medium"
            >
              Admin Dashboard Management
            </motion.p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <label
                className="text-sm font-semibold text-slate-700 ml-1"
                htmlFor="phoneEmailOrUid"
              >
                Account Information
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <User size={18} />
                </div>
                <Input
                  className={`pl-11 bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm ${errors.phoneEmailOrUid ? "border-red-500" : "hover:border-slate-300"}`}
                  placeholder="Phone or UID"
                  id="phoneEmailOrUid"
                  {...register("phoneEmailOrUid")}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <label
                className="text-sm font-semibold text-slate-700 ml-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <Input
                  className={`pl-11 bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm ${errors.password ? "border-red-500" : "hover:border-slate-300"}`}
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  {...register("password")}
                  required
                />
              </div>
            </motion.div>

            <AnimatePresence>
              {serverMessage && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-red-50 border border-red-100 rounded-xl p-4 overflow-hidden"
                >
                  <div className="flex gap-3">
                    <AlertCircle
                      className="text-red-500 flex-shrink-0"
                      size={18}
                    />
                    <ul className="text-xs font-semibold text-red-600 space-y-1">
                      {serverMessage.map(({ message }) => (
                        <li key={message}>{message}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-2"
            >
              <EcButton
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group border-none"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Sign In
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <User size={18} className="opacity-70" />
                    </motion.div>
                  </>
                )}
              </EcButton>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">
              Secure Access Only
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

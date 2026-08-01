"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { TErrorMessages, TErrorResponse } from "@/types/response";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

type PasswordFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  show: boolean;
  onToggle: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: string;
};

const PasswordField = ({
  id,
  label,
  placeholder,
  show,
  onToggle,
  register,
  error,
}: PasswordFieldProps) => (
  <div className="space-y-1">
    <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
      {label}
    </Label>
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        required
        className={`h-9 border-border pr-10 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 ${
          error ? "border-destructive" : ""
        }`}
        {...register(id)}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
    {error ? <p className="text-[11px] text-destructive">{error}</p> : null}
  </div>
);

const ChangePasswordPanel = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [serverMessages, setServerMessages] = useState<TErrorMessages[] | null>(
    null
  );
  const [show, setShow] = useState({
    previousPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setServerMessages(null);

    if (data.confirmPassword !== data.newPassword) {
      setServerMessages([
        {
          path: "confirmPassword",
          message: "New password and confirm password do not match",
        },
      ]);
      return;
    }

    try {
      const res = await changePassword(data).unwrap();
      reset();
      toast({
        className: "bg-success text-success-foreground border-none",
        title: res.message || "Password updated successfully",
      });
    } catch (error) {
      const err = (error as { data: TErrorResponse }).data;
      if (err?.errorMessages?.length) {
        setServerMessages(err.errorMessages);
      } else {
        toast({
          variant: "destructive",
          title: err?.message || "Failed to update password",
        });
      }
    }
  };

  const fieldError = (path: string) =>
    serverMessages?.find((item) => item.path === path)?.message;

  return (
    <div className="h-full rounded-xl border border-border bg-card p-5 shadow-none">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <KeyRound className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">
          Change Password
        </h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <PasswordField
          id="previousPassword"
          label="Current password"
          placeholder="Enter current password"
          show={show.previousPassword}
          onToggle={() =>
            setShow((s) => ({ ...s, previousPassword: !s.previousPassword }))
          }
          register={register}
          error={fieldError("previousPassword")}
        />
        <PasswordField
          id="newPassword"
          label="New password"
          placeholder="Enter new password"
          show={show.newPassword}
          onToggle={() =>
            setShow((s) => ({ ...s, newPassword: !s.newPassword }))
          }
          register={register}
          error={fieldError("newPassword")}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          placeholder="Re-enter new password"
          show={show.confirmPassword}
          onToggle={() =>
            setShow((s) => ({ ...s, confirmPassword: !s.confirmPassword }))
          }
          register={register}
          error={fieldError("confirmPassword")}
        />

        {serverMessages?.some((item) => !item.path) ? (
          <ul className="space-y-1 text-[11px] font-medium text-destructive">
            {serverMessages
              .filter((item) => !item.path)
              .map(({ message }) => (
                <li key={message}>{message}</li>
              ))}
          </ul>
        ) : null}

        <div className="flex justify-end pt-1">
          <Button
            disabled={isLoading}
            type="submit"
            size="sm"
            className="gap-1.5 rounded-lg"
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPanel;

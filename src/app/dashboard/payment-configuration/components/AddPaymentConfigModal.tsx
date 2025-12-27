"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  useAddPaymentMethodMutation,
  useUpdatePaymentMethodMutation,
} from "@/redux/features/paymentMethod/paymentMethodAPI";
import { TPaymentMethod } from "@/redux/features/paymentMethod/paymentMethodInterface";
import { setSelectedPaymentMethod } from "@/redux/features/paymentMethod/paymentMethodSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import AddRequiredInputs from "./AddRequiredInputs";

export default function AddPaymentConfigModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { selectedPaymentMethod } = useAppSelector(
    (state: RootState) => state.paymentMethod
  );
  const [addPaymentMethod, { isLoading: isAdding }] =
    useAddPaymentMethodMutation();
  const [updatePaymentMethod, { isLoading: isUpdating }] =
    useUpdatePaymentMethodMutation();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    register,
    watch,
    formState: { errors },
  } = useForm<TPaymentMethod>({
    defaultValues: {
      name: "",
      instructions: "",
      isActive: true,
      required_inputs: [],
    },
  });

  useEffect(() => {
    if (selectedPaymentMethod) {
      setValue("name", selectedPaymentMethod.name);
      setValue("instructions", selectedPaymentMethod.instructions || "");
      setValue("isActive", selectedPaymentMethod.isActive);
      setValue(
        "required_inputs",
        selectedPaymentMethod.required_inputs?.map((input) => ({ ...input })) ||
          []
      );
    } else {
      reset({
        name: "",
        instructions: "",
        isActive: true,
        required_inputs: [],
      });
    }
  }, [selectedPaymentMethod, setValue, reset]);

  const handleClose = () => {
    dispatch(setSelectedPaymentMethod(null));
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (data: TPaymentMethod) => {
    try {
      if (selectedPaymentMethod) {
        const res = await updatePaymentMethod({
          id: selectedPaymentMethod._id,
          payload: data,
        }).unwrap();
        toast({
          className: "bg-success text-white text-2xl",
          title: res.message || "Payment method updated successfully",
        });
      } else {
        const res = await addPaymentMethod(data).unwrap();
        toast({
          className: "bg-success text-white text-2xl",
          title: res.message || "Payment method added successfully",
        });
      }
      handleClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let errorsList = [];
      if (err.errors) {
        errorsList = err.errors;
      } else {
        const e =
          err?.data?.errorMessages && err?.data?.errorMessages[0]?.message;
        errorsList.push(err.message || e || "Something went wrong");
      }
      toast({
        className: "bg-red-600 text-white text-2xl",
        title: errorsList[0],
      });
    }
  };

  const isLoading = isAdding || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedPaymentMethod
              ? "Edit Payment Method"
              : "Add New Payment Method"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Payment Method Name</Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Payment Method Name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  placeholder="e.g. BKash or Cash on delivery"
                />
              )}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions (Optional)</Label>
            <Controller
              name="instructions"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="instructions"
                  placeholder="e.g. Please use cash out for personal numbers."
                />
              )}
            />
          </div>

          <div className="border-t pt-4">
            <AddRequiredInputs
              control={control}
              register={register}
              watch={watch}
              errors={errors}
            />
          </div>

          <div className="flex items-center space-x-2 border-t pt-4">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="isActive"
                />
              )}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : selectedPaymentMethod
                  ? "Update"
                  : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

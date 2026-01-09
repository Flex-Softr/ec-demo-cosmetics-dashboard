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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { setThumbnail } from "@/redux/features/imageSelector/imageSelectorSlice";
import {
  useAddPaymentMethodMutation,
  useUpdatePaymentMethodMutation,
} from "@/redux/features/paymentMethod/paymentMethodAPI";
import { TPaymentMethodPayload } from "@/redux/features/paymentMethod/paymentMethodInterface";
import { setSelectedPaymentMethod } from "@/redux/features/paymentMethod/paymentMethodSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { revalidateTag } from "@/utilities/revalidate";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import AddRequiredInputs from "./AddRequiredInputs";
import PaymentMethodMedia from "./PaymentMethodMedia";

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
  const { thumbnail } = useAppSelector(({ imageSelector }) => imageSelector);

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
  } = useForm<TPaymentMethodPayload>({
    defaultValues: {
      name: "",
      instructions: "",
      isActive: true,
      sortOrder: 1,
      required_inputs: [],
      logo: "",
    },
  });

  useEffect(() => {
    if (selectedPaymentMethod) {
      setValue("name", selectedPaymentMethod.name);
      setValue("instructions", selectedPaymentMethod.instructions || "");
      setValue("isActive", selectedPaymentMethod.isActive);
      setValue("sortOrder", selectedPaymentMethod.sortOrder || 1);
      setValue(
        "required_inputs",
        selectedPaymentMethod.required_inputs?.map((input) => ({ ...input })) ||
          []
      );
      if (selectedPaymentMethod.logo) {
        // Handle both string ID and populated object cases
        const imgId =
          typeof selectedPaymentMethod.logo === "string"
            ? selectedPaymentMethod.logo
            : (selectedPaymentMethod.logo as any)._id; // eslint-disable-line @typescript-eslint/no-explicit-any

        if (imgId) {
          dispatch(setThumbnail(imgId));
          setValue("logo", imgId);
        }
      }
    } else {
      reset({
        name: "",
        instructions: "",
        isActive: true,
        sortOrder: 1,
        required_inputs: [],
        logo: "",
      });
      dispatch(setThumbnail(""));
    }
  }, [selectedPaymentMethod, setValue, reset, dispatch]);

  useEffect(() => {
    if (thumbnail) {
      setValue("logo", thumbnail);
    }
  }, [thumbnail, setValue]);

  const handleClose = () => {
    dispatch(setSelectedPaymentMethod(null));
    setIsOpen(false);
    reset();
    dispatch(setThumbnail(""));
  };

  const onSubmit = async (data: TPaymentMethodPayload) => {
    // Sanitize payload: if logo is empty string, set to undefined to avoid ObjectId cast error
    const payload = {
      ...data,
      logo: data.logo === "" ? undefined : data.logo,
    };

    try {
      if (selectedPaymentMethod) {
        const res = await updatePaymentMethod({
          id: selectedPaymentMethod._id,
          payload: payload,
        }).unwrap();
        toast({
          className: "bg-success text-white text-2xl",
          title: res.message || "Payment method updated successfully",
        });
      } else {
        const res = await addPaymentMethod(payload).unwrap();
        toast({
          className: "bg-success text-white text-2xl",
          title: res.message || "Payment method added successfully",
        });
      }

      handleClose();
      await revalidateTag("paymentMethod");
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
          <div className="flex gap-4 items-center">
            <div className="shrink-0">
              <PaymentMethodMedia logo={selectedPaymentMethod?.logo} />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex-1 space-y-2">
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
              <div className="flex-1 space-y-2">
                <Label>Sort Order</Label>
                <Controller
                  control={control}
                  name="sortOrder"
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Order" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions (Optional)</Label>
            <Controller
              name="instructions"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="instructions"
                  placeholder="e.g. Please send money to the following number: 1234567890"
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

          <div className="flex justify-end space-x-6 pt-4">
            <Button variant="destructive" type="button" onClick={handleClose}>
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

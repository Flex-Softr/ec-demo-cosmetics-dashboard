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
  useAddCourierMutation,
  useUpdateCourierMutation,
} from "@/redux/features/courierConfiguration/courierConfigurationApi";
import { TCourierConfigInitialState } from "@/redux/features/courierConfiguration/courierConfigurationInterface";
import { setSelectedCourier } from "@/redux/features/courierConfiguration/courierConfigurationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

type FormData = {
  name: string;
  apiBaseUrl: string;
  apiKey: string;
  secretKey: string;
  credentials: { value: string }[];
  isActive: boolean;
};

export default function AddCourierConfigModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { selectedCourier } = useAppSelector(
    (state: RootState) =>
      state.courierConfiguration as TCourierConfigInitialState
  );
  const [addCourier, { isLoading: isAdding }] = useAddCourierMutation();
  const [updateCourier, { isLoading: isUpdating }] = useUpdateCourierMutation();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      apiBaseUrl: "",
      apiKey: "",
      secretKey: "",
      credentials: [],
      isActive: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "credentials",
  });

  useEffect(() => {
    if (selectedCourier) {
      setValue("name", selectedCourier.name);
      setValue("apiBaseUrl", selectedCourier.apiBaseUrl);
      setValue("apiKey", selectedCourier.apiKey);
      setValue("secretKey", selectedCourier.secretKey);
      setValue(
        "credentials",
        selectedCourier.credentials?.map((cred) => ({ value: cred })) || []
      );
      setValue("isActive", selectedCourier.isActive);
    } else {
      reset({
        name: "",
        apiBaseUrl: "",
        apiKey: "",
        secretKey: "",
        credentials: [],
        isActive: true,
      });
    }
  }, [selectedCourier, setValue, reset]);

  const handleClose = () => {
    dispatch(setSelectedCourier(null));
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      credentials: data.credentials.map((cred) => cred.value),
    };
    try {
      if (selectedCourier) {
        const res = await updateCourier({
          id: selectedCourier._id,
          payload: payload,
        }).unwrap();
        toast({
          className: "bg-success text-white text-2xl",
          title: res.message || "Courier updated successfully",
        });
      } else {
        const res = await addCourier(payload).unwrap();
        toast({
          className: "bg-success text-white text-2xl",
          title: res.message || "Courier added successfully",
        });
      }
      handleClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let errors = [];
      if (err.errors) {
        errors = err.errors;
      } else {
        const e =
          err?.data?.errorMessages && err?.data?.errorMessages[0]?.message;
        errors.push(err.message || e);
      }
      toast({
        className: "bg-red-600 text-white text-2xl",
        title: errors[0],
      });
    }
  };

  const isLoading = isAdding || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {selectedCourier ? "Edit Courier" : "Add New Courier"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Courier Name</Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Courier Name is required" }}
              render={({ field }) => (
                <Input {...field} id="name" placeholder="e.g. Pathao" />
              )}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiBaseUrl">Base URL</Label>
            <Controller
              name="apiBaseUrl"
              control={control}
              rules={{ required: "Base URL is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="apiBaseUrl"
                  placeholder="https://api.example.com"
                />
              )}
            />
            {errors.apiBaseUrl && (
              <span className="text-red-500 text-sm">
                {errors.apiBaseUrl.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Controller
              name="apiKey"
              control={control}
              rules={{ required: "API Key is required" }}
              render={({ field }) => <Input {...field} id="apiKey" />}
            />
            {errors.apiKey && (
              <span className="text-red-500 text-sm">
                {errors.apiKey.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="secretKey">Secret Key</Label>
            <Controller
              name="secretKey"
              control={control}
              render={({ field }) => <Input {...field} id="secretKey" />}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Additional Credentials</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ value: "" })}
              >
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end space-x-2">
                <div className="flex-1 space-y-2">
                  <Controller
                    name={`credentials.${index}.value` as const}
                    control={control}
                    rules={{ required: "Value is required" }}
                    render={({ field }) => (
                      <Input {...field} placeholder="Credential Value" />
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
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
              {isLoading ? "Saving..." : selectedCourier ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

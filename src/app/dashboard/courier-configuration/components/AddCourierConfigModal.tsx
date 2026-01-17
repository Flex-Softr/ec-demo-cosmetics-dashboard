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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import ImageSelectPopup from "@/components/uploader/ImageSelectPopup";
import {
  useAddCourierMutation,
  useUpdateCourierMutation,
} from "@/redux/features/courierConfiguration/courierConfigurationApi";
import {
  TCourierConfigInitialState,
  TCourierCredentials,
} from "@/redux/features/courierConfiguration/courierConfigurationInterface";
import { setSelectedCourier } from "@/redux/features/courierConfiguration/courierConfigurationSlice";
import { setThumbnail } from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

type FormData = {
  description: string;
  thumb?: string;
  credentials: TCourierCredentials[];
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
  const [imagePopupOpen, setImagePopupOpen] = useState(false);

  const { selectedCourier } = useAppSelector(
    (state: RootState) =>
      state.courierConfiguration as TCourierConfigInitialState
  );

  const { thumbnail: selectedThumb } = useAppSelector(
    (state: RootState) => state.imageSelector
  );

  const [addCourier, { isLoading: isAdding }] = useAddCourierMutation();
  const [updateCourier, { isLoading: isUpdating }] = useUpdateCourierMutation();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    // watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      description: "",
      thumb: undefined,
      credentials: [],
      isActive: true,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "credentials",
  });

  // Sync Redux thumbnail with form
  useEffect(() => {
    if (selectedThumb) {
      setValue("thumb", selectedThumb ?? undefined);
    }
  }, [selectedThumb, setValue]);

  useEffect(() => {
    if (selectedCourier) {
      setValue("description", selectedCourier.description || "");
      setValue("thumb", selectedCourier.thumb || undefined);
      if (selectedCourier.thumb) {
        dispatch(setThumbnail(selectedCourier.thumb));
      }
      setValue("credentials", selectedCourier.credentials || []);
      setValue("isActive", selectedCourier.isActive);
    } else {
      reset({
        description: "",
        thumb: undefined,
        credentials: [],
        isActive: true,
      });
      dispatch(setThumbnail(""));
    }
  }, [selectedCourier, setValue, reset, dispatch]);

  const handleClose = () => {
    dispatch(setSelectedCourier(null));
    dispatch(setThumbnail(""));
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      credentials: data.credentials,
    };
    try {
      if (selectedCourier) {
        const res = await updateCourier({
          id: selectedCourier._id,
          payload: { ...payload, thumb: payload?.thumb ?? undefined },
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
        title: errors[0] || "Something went wrong",
      });
    }
  };

  const isLoading = isAdding || isUpdating;
  // const currentThumb = watch("thumb");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-none">
        <DialogHeader className="p-6 pb-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-[#1e2337]">
            {selectedCourier ? "Edit Shipping Method" : "Add Shipping Method"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
          {/* Active Status Section */}
          <div className="flex items-center justify-between p-5 border border-gray-100 rounded-xl bg-white shadow-sm">
            <Label
              htmlFor="isActive"
              className="text-base font-medium text-[#1e2337]"
            >
              Active Status
            </Label>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="isActive"
                  className="data-[state=checked]:bg-[#3c51d6]"
                />
              )}
            />
          </div>

          {/* Configuration Section (Hidden in screenshot but needed for functional parity) */}

          {/* Thumbnail Section */}
          {/* <div className="space-y-3">
            <Label className="text-base font-bold text-[#1e2337]">
              Thumbnail
            </Label>
            <div className="flex flex-col gap-3">
              <div className="relative w-40 h-32 border border-gray-100 rounded-2xl cursor-pointer overflow-hidden flex items-center justify-center bg-white shadow-sm hover:border-gray-200 transition-all group">
                {currentThumb ? (
                  <>
                    <Image
                      src={formatImageSrc(currentThumb)}
                      alt="Thumbnail"
                      fill
                      className="object-contain p-4"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-gray-500/80 hover:bg-red-500 text-white p-1 rounded-full transition-colors z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue("thumb", "");
                        dispatch(setThumbnail(""));
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <div
                    className="flex flex-col items-center gap-2"
                    onClick={() => setImagePopupOpen(true)}
                  >
                    <Plus className="h-6 w-6 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">
                      Add Image
                    </span>
                  </div>
                )}
                
                {currentThumb && (
                  <div
                    className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setImagePopupOpen(true)}
                  />
                )}
              </div>
              <p className="text-sm text-[#7e84a3] font-medium">
                Upload a new image to replace the existing one.
              </p>
            </div>
          </div> */}

          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-[#1e2337]">Credentials</h3>
            {/* Render additional credentials if any */}
            <div className="grid grid-cols-2 gap-5">
              {fields.map((field, index) => (
                <div key={field.id} className="">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-[#1e2337] capitalize">
                      {field.key}
                    </Label>
                    <Controller
                      name={`credentials.${index}.value` as const}
                      control={control}
                      render={({ field: inputField }) => (
                        <Input
                          {...inputField}
                          placeholder="Value"
                          className="h-11 rounded-lg border-gray-200"
                        />
                      )}
                    />

                    {errors.credentials?.[index]?.value && (
                      <span className="text-red-500 text-xs">
                        {errors.credentials?.[index]?.value?.message}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-[#1e2337]"
            >
              Description
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Courier description..."
                  value={field.value || ""}
                  className="min-h-[100px] rounded-lg border-gray-200"
                />
              )}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isLoading} className="">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
      <ImageSelectPopup
        open={imagePopupOpen}
        handleOpen={setImagePopupOpen}
        modalTitle="Select Courier Thumbnail"
        click="thumbnail"
      />
    </Dialog>
  );
}

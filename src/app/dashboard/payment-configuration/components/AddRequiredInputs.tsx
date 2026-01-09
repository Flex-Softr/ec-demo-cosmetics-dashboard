"use client";

import CommonSelect from "@/components/commonSelect/CommonSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TPaymentMethodPayload } from "@/redux/features/paymentMethod/paymentMethodInterface";
import { Plus, Trash2 } from "lucide-react";
import {
  Control,
  Controller,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

const INPUT_TYPE_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  // { value: "radio", label: "Radio" },
  { value: "select", label: "Select" },
];

type TProps = {
  control: Control<TPaymentMethodPayload>;
  register: UseFormRegister<TPaymentMethodPayload>;
  watch: UseFormWatch<TPaymentMethodPayload>;
  errors: FieldErrors<TPaymentMethodPayload>;
};

export default function AddRequiredInputs({
  control,
  register,
  watch,
  errors,
}: TProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "required_inputs",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-3">
        <Label>Required Inputs</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ type: "text", name: "", is_required: false, enums: "" })
          }
          className="text-gray-600 dark:text-foreground rounded-full"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Field
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-gray-500">
          Click the &quot;Add Field&quot; button to insert input fields for this
          method.
        </p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 sm:grid-cols-8 gap-6 items-center border rounded-lg p-3"
          >
            {/* Type */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor={`required_inputs.${index}.type`}>Type</Label>
              <Controller
                name={`required_inputs.${index}.type`}
                control={control}
                render={({ field }) => (
                  <CommonSelect
                    value={field.value ?? INPUT_TYPE_OPTIONS[0].value}
                    options={INPUT_TYPE_OPTIONS}
                    onChange={field.onChange}
                    placeholder="Select type"
                    className="w-full"
                  />
                )}
              />
            </div>

            {/* Name */}
            <div className="sm:col-span-4 space-y-2">
              <Label>Field Name</Label>
              <Input
                {...register(`required_inputs.${index}.name` as const, {
                  required: "Field name is required",
                })}
                placeholder="e.g. Mobile number"
              />
              {errors.required_inputs &&
                errors.required_inputs[index]?.name && (
                  <p className="text-red-500 text-sm">
                    {errors.required_inputs[index]?.name?.message}
                  </p>
                )}
              {watch(`required_inputs.${index}.type`) === "select" ? (
                <Input
                  {...register(`required_inputs.${index}.enums` as const, {
                    required: "Select options is required",
                  })}
                  placeholder="e.g. Option1, Option2, Option3 (comma separated)"
                />
              ) : null}
            </div>

            {/* Is Required */}
            <Controller
              control={control}
              name={`required_inputs.${index}.is_required`}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <Label>Required</Label>
                  <Switch
                    checked={field.value} // ensure controlled
                    onCheckedChange={field.onChange} // update form state
                    className="cursor-pointer"
                  />
                </div>
              )}
            />

            {/* Remove */}
            <div className="flex justify-end pt-6">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

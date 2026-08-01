"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import MultiSelect, { MultiSelectOption } from "@/components/ui/multi-select";
import { TSelectedAttribute } from "@/redux/features/addProduct/variation/interface";
import { Controller, useFormContext } from "react-hook-form";

const Attributes = ({
  attributes: availableAttributes,
}: {
  attributes: TSelectedAttribute[];
}) => {
  const {
    control,
    watch,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const selectedAttributes = watch("attributes") || [];

  const handleSelectAll = (index: number, attr: TSelectedAttribute) => {
    const allOptions =
      attr.child?.map((item) => ({
        label: item.label,
        value: String(item.value),
      })) || [];

    setValue(`attributeValues.${index}`, allOptions, {
      shouldValidate: true,
    });
  };

  const attributeOptions: MultiSelectOption[] = availableAttributes.map(
    (attr) => ({
      label: attr.label,
      value: String(attr.value),
      child: attr.child,
    })
  );

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label>Select Attribute</Label>
        <Controller
          control={control}
          name="attributes"
          defaultValue={[]}
          render={({ field }) => (
            <MultiSelect
              options={attributeOptions}
              value={(field.value as TSelectedAttribute[])?.map((attr) => ({
                label: attr.label,
                value: String(attr.value),
                child: attr.child,
              }))}
              onChange={(val) => {
                const newAttributes: TSelectedAttribute[] = val.map((item) => ({
                  label: item.label,
                  value: item.value,
                  child: (item.child as TSelectedAttribute["child"]) || [],
                }));
                const oldAttributes =
                  (field.value as TSelectedAttribute[]) || [];
                const currentValues = getValues("attributeValues") || [];

                const newValues = newAttributes.map((newAttr) => {
                  const oldIndex = oldAttributes.findIndex(
                    (oldAttr) => oldAttr.label === newAttr.label
                  );
                  return oldIndex >= 0 ? currentValues[oldIndex] : [];
                });

                clearErrors("attributeValues");
                setValue("attributeValues", newValues, {
                  shouldValidate: true,
                });
                field.onChange(newAttributes);
              }}
              placeholder="Select attribute..."
            />
          )}
        />
        {errors.attributes && (
          <p className="mt-1 text-sm text-destructive">
            {errors.attributes.message as string}
          </p>
        )}
      </div>
      {selectedAttributes.length > 0 &&
        selectedAttributes.map((attr: TSelectedAttribute, index: number) => (
          <div className="space-y-1" key={attr.label}>
            <div className="flex items-center justify-between">
              <Label>Select {attr.label}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSelectAll(index, attr)}
                className="h-7 text-xs"
              >
                Select All
              </Button>
            </div>
            <Controller
              control={control}
              name={`attributeValues.${index}`}
              render={({ field, fieldState: { error } }) => (
                <>
                  <MultiSelect
                    options={
                      attr.child?.map((item) => ({
                        label: item.label,
                        value: String(item.value),
                      })) || []
                    }
                    value={(field.value || []).map(
                      (item: { label: string; value: string }) => ({
                        label: item.label,
                        value: String(item.value),
                      })
                    )}
                    onChange={(val) => field.onChange(val)}
                    placeholder={`Select ${attr.label}...`}
                  />
                  {error && (
                    <p className="mt-1 text-sm text-destructive">
                      {error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        ))}
    </div>
  );
};

export default Attributes;

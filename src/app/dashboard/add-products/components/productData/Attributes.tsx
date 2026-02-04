import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TSelectedAttribute } from "@/redux/features/addProduct/variation/interface";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";

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

  // Watch currently selected attributes to render value selectors
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

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label>Select Attribute</Label>
        <Controller
          control={control}
          name="attributes"
          defaultValue={[]}
          render={({ field }) => (
            <Select
              isMulti
              isSearchable
              options={availableAttributes}
              value={field.value}
              onChange={(val) => {
                const newAttributes = (val as TSelectedAttribute[]) || [];
                const oldAttributes =
                  (field.value as TSelectedAttribute[]) || [];
                const currentValues = getValues("attributeValues") || [];

                // Sync attributeValues to match the new attributes list order/presence
                const newValues = newAttributes.map((newAttr) => {
                  const oldIndex = oldAttributes.findIndex(
                    (oldAttr) => oldAttr.label === newAttr.label // Assuming label is unique ID
                  );
                  return oldIndex >= 0 ? currentValues[oldIndex] : [];
                });

                // Clear errors first to ensure clean state
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
          <p className="text-red-500 text-sm mt-1">
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
                  <Select
                    isMulti
                    isSearchable
                    options={attr.child?.map((item) => ({
                      label: item.label,
                      value: String(item.value),
                    }))}
                    value={field.value}
                    onChange={(val) => {
                      // Store in specific structure expected by generateVariations?
                      // The previous code stored { index, child: val } in Redux.
                      // Here we just store the array of values at index 'index'.
                      field.onChange(val);
                    }}
                    placeholder={`Select ${attr.label}...`}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
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

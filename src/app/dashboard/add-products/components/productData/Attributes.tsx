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
    formState: { errors },
  } = useFormContext();

  // Watch currently selected attributes to render value selectors
  const selectedAttributes = watch("attributes") || [];

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
                field.onChange(val);
                // Ensure attributeValues array matches selected attributes length/order if needed?
                // Or just let it sync naturally.
                // If an attribute is removed, we might want to remove its corresponding values.
                // For simplicity, we just update the attributes list here.
                // Complex syncing might be needed for variations.
                // Logic to clean up values for removed attributes could act here
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
            <Label>Select {attr.label}</Label>
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

import { Button } from "@/components/ui/button";
import { TSelectedAttribute } from "@/redux/features/addProduct/variation/interface";
import { useMemo, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import generateVariations from "../../lib/generateVariation";
import SetBulkPrice from "./SetBulkPrice";
import SingleVariation from "./SingleVariation";

const Variations = () => {
  const {
    control,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext();
  const { fields, replace, remove } = useFieldArray({
    control,
    name: "variations",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const attributesRaw = watch("attributes");
  const valuesRaw = watch("attributeValues");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedAttributes = useMemo(
    () => (attributesRaw || []) as TSelectedAttribute[],
    [attributesRaw]
  );
  const selectedAttributeValues = useMemo(() => valuesRaw || [], [valuesRaw]);

  // Memoize formatted data construction
  const formattedData = useMemo(() => {
    return selectedAttributes.map((attr: { label: string }, index: number) => ({
      label: attr.label,
      child: selectedAttributeValues[index] || [],
    }));
  }, [selectedAttributes, selectedAttributeValues]);

  // Calculate theoretical total variations
  const theoreticalCombinationsCount = useMemo(() => {
    return formattedData.reduce(
      (acc, curr) => acc * (curr.child.length || 1),
      formattedData.length > 0 ? 1 : 0
    );
  }, [formattedData]);

  // Derived stale check (stateless)
  const isStale = useMemo(() => {
    if (fields.length === 0) return false;

    // 1. Check if axes match (keys)
    const currentAxes = formattedData
      .map((d) => d.label)
      .sort()
      .join(",");
    const fieldAxes = Object.keys(
      (fields[0] as unknown as { attributes: Record<string, string> })
        .attributes || {}
    )
      .sort()
      .join(",");

    if (currentAxes !== fieldAxes) return true;

    // 2. Check if total count matches
    // Note: This enforces that all combinations must be present.
    // If user deleted one manually, this will flag as stale (which allows "Update/Reset").
    if (fields.length !== theoreticalCombinationsCount) return true;

    // 3. Check if all values in variations are valid options
    // (e.g. if "Red" was renamed/removed from attributes but exists in variation)
    const invalidValue = fields.some((field) => {
      const attrs = (field as unknown as { attributes: Record<string, string> })
        .attributes;
      return Object.entries(attrs).some(([key, value]) => {
        const attributeOption = formattedData.find((d) => d.label === key);
        if (!attributeOption) return true; // Axis missing (covered by #1 but safe double check)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return !attributeOption.child.some((c: any) => c.label === value);
      });
    });

    if (invalidValue) return true;

    return false;
  }, [fields, formattedData, theoreticalCombinationsCount]);

  const variation = () => {
    setErrorMessage(null);
    // Filter to ensure we have values
    const validValues = formattedData.filter(
      (v: { child: unknown[] }) => v.child && v.child.length > 0
    );

    if (validValues.length < 1) {
      setErrorMessage(
        "Please select attributes and values to generate variations!"
      );
      return;
    }

    if (validValues.length !== formattedData.length) {
      setErrorMessage("Please select values for all attributes!");
      return;
    }

    const currentVariations = getValues("variations") || [];
    const generatedData = generateVariations(formattedData, currentVariations);

    replace(generatedData);
  };

  const showText = selectedAttributes.length < 1 && fields.length < 1;
  // Show button if no variations OR if data is stale (attributes changed)
  const showBtn =
    (selectedAttributes.length > 0 && fields.length < 1) || isStale;
  // Show list only if we have variations AND data is NOT stale
  const showList = fields.length > 0 && !isStale;

  return (
    <div className="space-y-2 min-h-20 flex flex-col items-center justify-center">
      {showText && <p>Select attributes to generate product variations.</p>}

      {showBtn && (
        <div className="flex flex-col items-center gap-2">
          {isStale && (
            <p className="text-yellow-600 text-sm">
              Attributes changed. Regenerate to update variations (existing
              values preserved where possible).
            </p>
          )}
          <Button type="button" onClick={variation}>
            {isStale ? "Update Variations" : "Generate variations"}
          </Button>
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </div>
      )}

      {showList && (
        <>
          <Button
            type="button"
            onClick={() => {
              remove();
              setErrorMessage(null);
            }}
            className="mb-2"
          >
            Remove all variations
          </Button>
          <SetBulkPrice />

          {fields.map((field, index) => (
            <SingleVariation
              key={field.id}
              index={index}
              item={
                (field as unknown as { attributes: Record<string, string> })
                  .attributes
              }
            />
          ))}
        </>
      )}

      {errors.variations && (
        <p className="text-red-500 text-sm mt-1">
          {errors.variations.message as string}
        </p>
      )}
    </div>
  );
};

export default Variations;

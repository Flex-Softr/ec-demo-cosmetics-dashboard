"use client";
import { Button } from "@/components/ui/button";
import { useFieldArray, useFormContext } from "react-hook-form";
import generateVariations from "../../lib/generateVariation";
import SingleVariation from "./SingleVariation";

const Variations = () => {
  const { control, watch } = useFormContext();
  const { fields, replace, remove } = useFieldArray({
    control,
    name: "variations",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedAttributes = (watch("attributes") || []) as any[];
  const selectedAttributeValues = watch("attributeValues") || [];

  const variation = () => {
    // Reconstruct input for generateVariations
    // We need to merge selectedAttributes (which has labels) with selectedAttributeValues (which has options)
    const formattedData = selectedAttributes.map(
      (attr: { label: string }, index: number) => ({
        label: attr.label,
        child: selectedAttributeValues[index] || [],
      })
    );

    // Filter to ensure we have values
    const validValues = formattedData.filter(
      (v: { child: unknown[] }) => v.child && v.child.length > 0
    );

    if (validValues.length < 1) {
      alert("Please select attributes and values to generate variations!");
      return;
    }

    const generatedData = generateVariations(formattedData, []);

    replace(generatedData);
  };

  const showText = selectedAttributes.length < 1 && fields.length < 1;
  const showBtn = selectedAttributes.length > 0 && fields.length < 1;

  return (
    <div className="space-y-2 min-h-20 flex flex-col items-center justify-center">
      {showText ? (
        <p>Select attributes to generate product variations.</p>
      ) : showBtn ? (
        <Button type="button" onClick={variation}>
          Generate variations
        </Button>
      ) : (
        <>
          <Button type="button" onClick={() => remove()} className="mb-2">
            Remove variation
          </Button>
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
    </div>
  );
};

export default Variations;

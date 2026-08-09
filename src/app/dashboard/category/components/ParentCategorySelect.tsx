"use client";

import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { TCategories } from "../lib/category.interface";
import Select from "react-select";
import { FormLabel } from "@/components/ui/form";
import { useFormContext, Controller } from "react-hook-form";

type Props = {
  excludeId?: string;
};

export default function ParentCategorySelect({ excludeId }: Props) {
  const { data, isLoading } = useGetCategoriesQuery({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseData: any = data?.data;
  const categories =
    (responseData?.data as TCategories[]) ||
    (data?.data?.data as TCategories[]) ||
    [];

  const flattenCategories = (
    cats: TCategories[],
    prefix = "",
    currentLevel = 0
  ): { value: string; label: string; isDisabled?: boolean }[] => {
    let result: { value: string; label: string; isDisabled?: boolean }[] = [];
    for (const cat of cats) {
      if (cat._id === excludeId) continue;
      const label = prefix ? `${prefix} > ${cat.name}` : cat.name;
      // If the category is already at level 3 (4th level), it cannot have children (5th level)
      result.push({ value: cat._id, label, isDisabled: currentLevel >= 3 });
      if (cat.children && cat.children.length > 0) {
        result = result.concat(
          flattenCategories(cat.children, label, currentLevel + 1)
        );
      }
    }
    return result;
  };

  const options = flattenCategories(categories);
  const { control } = useFormContext();

  return (
    <div className="space-y-2 flex flex-col">
      <FormLabel>Parent</FormLabel>
      <Controller
        name="parent"
        control={control}
        render={({ field: { onChange, value } }) => {
          const selectedOption =
            options.find((opt) => opt.value === value) || null;
          return (
            <Select
              options={options}
              isClearable
              isSearchable
              isLoading={isLoading}
              placeholder={isLoading ? "Loading..." : "Select parent..."}
              onChange={(selected) =>
                onChange(selected ? selected.value : undefined)
              }
              value={selectedOption}
              classNames={{
                control: () => "!min-h-10 !rounded-md !border-input",
              }}
            />
          );
        }}
      />
    </div>
  );
}

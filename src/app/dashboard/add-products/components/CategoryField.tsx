"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useFormContext } from "react-hook-form";

type TCategories = {
  _id: string;
  name: string;
  subcategories?: TCategories[];
};

export function CategoryField() {
  const { data, isLoading } = useGetCategoriesQuery({ isActive: true });
  const categories = data?.data?.data || [];

  const {
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const selected: string[] = watch("category") || [];
  /** Toggle single category id */
  const toggle = (id: string, checked: boolean) => {
    let updated = [...selected];
    if (checked) updated.push(id);
    else updated = updated.filter((c) => c !== id);
    setValue("category", updated, { shouldValidate: true });
    clearErrors("category");
  };

  /** Helper to collect all nested child IDs recursively */
  const getAllChildIds = (category: TCategories): string[] => {
    const ids: string[] = [];
    if (category.subcategories?.length) {
      for (const child of category.subcategories) {
        ids.push(child._id, ...getAllChildIds(child));
      }
    }
    return ids;
  };

  /**
   * Recursive render of category tree
   */
  const renderCategories = (items: TCategories[], level = 0) => {
    return (
      <div className={cn("flex flex-col gap-2", level > 0 && "ml-6")}>
        {items.map((cat) => {
          const isChecked = selected.includes(cat._id);

          return (
            <div key={cat._id} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    toggle(cat._id, Boolean(checked));

                    // If selecting a parent, auto-select its children
                    if (checked && cat.subcategories?.length) {
                      const childIds = getAllChildIds(cat);
                      const updated = Array.from(
                        new Set([...selected, cat._id, ...childIds])
                      );
                      setValue("category", updated, { shouldValidate: true });
                    }

                    // If unchecking a parent, also uncheck all children
                    if (!checked && cat.subcategories?.length) {
                      const childIds = getAllChildIds(cat);
                      const updated = selected.filter(
                        (id) => ![cat._id, ...childIds].includes(id)
                      );
                      setValue("category", updated, { shouldValidate: true });
                    }
                  }}
                />
                <span className={cn("text-sm", level === 0 && "font-medium")}>
                  {cat.name}
                </span>
              </div>

              {cat.subcategories &&
                cat.subcategories.length > 0 &&
                renderCategories(cat.subcategories, level + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <SectionContentWrapper
      heading="Select Category"
      height="max-h-[450px] overflow-y-auto"
    >
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-5 w-full animate-pulse rounded bg-gray-300"
            />
          ))}
        </div>
      ) : (
        renderCategories(categories)
      )}

      {errors.category && (
        <p className="mt-2 text-red-500 text-sm">
          {String(errors.category.message)}
        </p>
      )}
    </SectionContentWrapper>
  );
}

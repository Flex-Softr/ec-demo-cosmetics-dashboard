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

export function CategoryField({ embedded = false }: { embedded?: boolean }) {
  const { data, isLoading } = useGetCategoriesQuery({ isActive: true });
  const categories = data?.data?.data || [];

  const {
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const selected: string[] = watch("category") || [];

  const toggle = (id: string, checked: boolean) => {
    let updated = [...selected];
    if (checked) updated.push(id);
    else updated = updated.filter((c) => c !== id);
    setValue("category", updated, { shouldValidate: true });
    clearErrors("category");
  };

  const getAllChildIds = (category: TCategories): string[] => {
    const ids: string[] = [];
    if (category.subcategories?.length) {
      for (const child of category.subcategories) {
        ids.push(child._id, ...getAllChildIds(child));
      }
    }
    return ids;
  };

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

                    if (checked && cat.subcategories?.length) {
                      const childIds = getAllChildIds(cat);
                      const updated = Array.from(
                        new Set([...selected, cat._id, ...childIds])
                      );
                      setValue("category", updated, { shouldValidate: true });
                    }

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

  const content = (
    <>
      <div className="max-h-[280px] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-5 w-full animate-pulse rounded bg-muted"
              />
            ))}
          </div>
        ) : (
          renderCategories(categories)
        )}
      </div>

      {errors.category && (
        <p className="mt-2 text-sm text-destructive">
          {String(errors.category.message)}
        </p>
      )}
    </>
  );

  if (embedded) return content;

  return (
    <SectionContentWrapper
      heading="Select Category"
      height="max-h-[450px] overflow-y-auto"
    >
      {content}
    </SectionContentWrapper>
  );
}

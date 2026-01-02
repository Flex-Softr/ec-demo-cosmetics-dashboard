"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const TitleInput = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const title = watch("title");

  // We'll keep local state for manual edits valid only for form lifetime?
  // Actually, standard behavior is: if user hasn't manually edited slug, it auto-generates.
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  // Sync title changes to slug if not manually edited
  // Using useEffect to listen to title changes specifically to avoid "onChange" prop collision with register
  useEffect(() => {
    if (title && !isSlugManuallyEdited) {
      const newSlug = generateSlug(title);
      setValue("slug", newSlug, { shouldValidate: true });
    }
  }, [title, isSlugManuallyEdited, setValue]);

  return (
    <SectionContentWrapper heading={"Product Title and Slug"}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Title</label>
          <Input placeholder="Product Title" {...register("title")} />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message as string}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Slug</label>
          <Input
            placeholder="product-slug"
            {...register("slug", {
              onChange: () => {
                setIsSlugManuallyEdited(true);
              },
            })}
          />
          {errors.slug && (
            <p className="text-red-500 text-sm mt-1">
              {errors.slug.message as string}
            </p>
          )}
        </div>
      </div>
    </SectionContentWrapper>
  );
};

export default TitleInput;

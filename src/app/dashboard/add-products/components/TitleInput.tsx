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
  const [isTitleEdited, setIsTitleEdited] = useState(false);
  const [slugSuffix, setSlugSuffix] = useState("");

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, "") // remove special chars but keep Bangla (\u0980-\u09FF)
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-"); // remove multiple hyphens
  };

  const slug = watch("slug");
  useEffect(() => {
    if (slug && !isTitleEdited) {
      setSlugSuffix(slug.split("-").pop()!);
    }
  }, [isTitleEdited, slug]);
  // Sync title changes to slug if not manually edited
  // Using useEffect to listen to title changes specifically to avoid "onChange" prop collision with register
  useEffect(() => {
    if (!isTitleEdited) return;
    if (title && !isSlugManuallyEdited) {
      // 🔁 title changed → regenerate base + keep suffix
      const base = generateSlug(title);
      const newSlug = slugSuffix ? `${base}-${slugSuffix}` : base;

      setValue("slug", newSlug, { shouldValidate: true });
      setValue("slug", newSlug, { shouldValidate: true });
    }
  }, [isTitleEdited, title, isSlugManuallyEdited, setValue, slugSuffix]);

  return (
    <SectionContentWrapper heading={"Product Title and Slug"}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Title
          </label>
          <Input
            placeholder="Product Title"
            className="rounded-lg"
            {...register("title", {
              onChange: () => {
                setIsTitleEdited(true);
              },
            })}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-destructive">
              {errors.title.message as string}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Slug
          </label>
          <Input
            placeholder="product-slug"
            className="rounded-lg"
            {...register("slug", {
              onChange: () => {
                setIsSlugManuallyEdited(true);
              },
            })}
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-destructive">
              {errors.slug.message as string}
            </p>
          )}
        </div>
      </div>
    </SectionContentWrapper>
  );
};

export default TitleInput;

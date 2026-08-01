"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { useGetBrandsQuery } from "@/redux/features/brand/brandApi";
import { Controller, useFormContext } from "react-hook-form";

const BrandInput = ({ embedded = false }: { embedded?: boolean }) => {
  const { data, isLoading } = useGetBrandsQuery({ isActive: true });
  const brands = data?.data?.data || [];
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const content = (
    <div className="flex flex-col gap-2">
      <Controller
        name="brand"
        control={control}
        render={({ field }) => (
          <Select
            value={field.value || undefined}
            onValueChange={field.onChange}
            disabled={isLoading}
          >
            <SelectTrigger className="h-9 border-border focus:border-muted-foreground/40 focus:ring-1 focus:ring-muted-foreground/20">
              <SelectValue
                placeholder={isLoading ? "Loading brands..." : "Select brand"}
              />
            </SelectTrigger>
            <SelectContent>
              {brands.map(({ _id, name }: { _id: string; name: string }) => (
                <SelectItem key={_id} value={_id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors.brand && (
        <p className="mt-1 text-sm text-destructive">
          {errors.brand.message as string}
        </p>
      )}
    </div>
  );

  if (embedded) return content;

  return (
    <SectionContentWrapper heading="Product brand">
      {content}
    </SectionContentWrapper>
  );
};

export default BrandInput;

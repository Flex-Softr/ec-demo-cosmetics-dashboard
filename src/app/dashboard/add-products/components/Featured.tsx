"use client";

import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Switch } from "@/components/ui/switch";
import { Controller, useFormContext } from "react-hook-form";

const Featured = ({ embedded = false }: { embedded?: boolean }) => {
  const { control } = useFormContext();

  const content = (
    <div className="flex items-center gap-3">
      <Controller
        control={control}
        name="featured"
        render={({ field: { value, onChange } }) => (
          <Switch checked={!!value} onCheckedChange={onChange} id="featured" />
        )}
      />
      <label htmlFor="featured" className="text-sm text-muted-foreground">
        Mark this product as featured
      </label>
    </div>
  );

  if (embedded) return content;

  return (
    <SectionContentWrapper heading="Is Featured?">
      {content}
    </SectionContentWrapper>
  );
};

export default Featured;

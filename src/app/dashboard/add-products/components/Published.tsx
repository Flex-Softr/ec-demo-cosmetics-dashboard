"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_STATUS } from "@/const/products";
import { Controller, useFormContext } from "react-hook-form";

const Published = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <SectionContentWrapper heading="Published status">
      <div className="space-y-2">
        <Controller
          name="publishedStatus"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-10 capitalize rounded-lg">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PRODUCT_STATUS)
                  .filter((status) => status !== PRODUCT_STATUS.DRAFT)
                  .map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="capitalize"
                    >
                      {status}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.publishedStatus && (
          <p className="mt-1 text-sm text-destructive">
            {errors.publishedStatus.message as string}
          </p>
        )}
      </div>
    </SectionContentWrapper>
  );
};

export default Published;

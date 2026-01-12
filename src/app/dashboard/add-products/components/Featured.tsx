import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Switch } from "@/components/ui/switch";
import { Controller, useFormContext } from "react-hook-form";

const Featured = () => {
  const { control } = useFormContext();

  return (
    <SectionContentWrapper heading="Is Featured?">
      <div className="flex items-center gap-3 mb-3">
        <Controller
          control={control}
          name="featured"
          render={({ field: { value, onChange } }) => (
            <Switch
              checked={!!value}
              onCheckedChange={onChange}
              id="featured"
            />
          )}
        />
      </div>
    </SectionContentWrapper>
  );
};

export default Featured;

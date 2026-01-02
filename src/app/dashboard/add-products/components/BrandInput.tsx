"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetBrandsQuery } from "@/redux/features/brand/brandApi";
import { Controller, useFormContext } from "react-hook-form";

const BrandInput = () => {
  const { data, isLoading } = useGetBrandsQuery({ isActive: true });
  const brands = data?.data || [];
  const { control } = useFormContext();

  return (
    <SectionContentWrapper heading="Product brand">
      <Controller
        name="brand"
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={(v) => field.onChange(v === "Select brand" ? "" : v)}
            value={field.value || "Select brand"}
          >
            <SelectTrigger className="border-primary focus:ring-primary focus:ring-1">
              <SelectValue
                placeholder={isLoading ? "Loading brands..." : "Select brand"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="capitalized">
                <SelectItem value="Select brand">Select brand</SelectItem>
                {brands.map(({ _id, name }) => (
                  <SelectItem key={_id} value={_id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
    </SectionContentWrapper>
  );
};

export default BrandInput;

// <Select onValueChange={(v) => handleChange(v)}>
//   <SelectTrigger className=" border-primary focus:ring-0">
//     <SelectValue placeholder={defaultValue?.name || "Select brand"} />
//   </SelectTrigger>
//   <SelectContent>
//     <SelectGroup>
//       {brands.map(({ _id, name }) => (
//         <SelectItem key={_id} value={_id}>
//           {name}
//         </SelectItem>
//       ))}
//     </SelectGroup>
//   </SelectContent>
// </Select>;

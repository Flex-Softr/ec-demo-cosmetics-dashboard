"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { useGetBrandsQuery } from "@/redux/features/brand/brandApi";
import { useFormContext } from "react-hook-form";

const BrandInput = () => {
  const { data, isLoading } = useGetBrandsQuery({ isActive: true });
  const brands = data?.data?.data || [];
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <SectionContentWrapper heading="Product brand">
      <div className="flex flex-col gap-2">
        <select
          {...register("brand")}
          className="border h-9 border-primary outline-primary rounded-md px-2 cursor-pointer w-full text-sm"
          defaultValue=""
        >
          <option value="" disabled>
            {isLoading ? "Loading brands..." : "Select brand"}
          </option>
          {brands.map(({ _id, name }) => (
            <option key={_id} value={_id}>
              {name}
            </option>
          ))}
        </select>
        {errors.brand && (
          <p className="text-red-500 text-sm mt-1">
            {errors.brand.message as string}
          </p>
        )}
      </div>
    </SectionContentWrapper>
  );
};

export default BrandInput;

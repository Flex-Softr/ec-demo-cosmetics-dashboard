"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Button } from "@/components/ui/button";
import { PRODUCT_STATUS } from "@/const/products";
import { useFormContext } from "react-hook-form";

const Published = ({
  productId,
  isLoading,
}: {
  productId: string;
  isLoading?: boolean;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <SectionContentWrapper heading="Published status" className="text-center">
        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <select
              {...register("publishedStatus")}
              id="status"
              className="capitalize border h-9 border-primary outline-primary rounded-md px-2 cursor-pointer w-full"
            >
              {Object.values(PRODUCT_STATUS)
                .filter((status) => status !== PRODUCT_STATUS.DRAFT)
                .map((status) => (
                  <option key={status} value={status} className="capitalize">
                    {status}
                  </option>
                ))}
            </select>
            {errors.publishedStatus && (
              <p className="text-red-500 text-sm mt-1">
                {errors.publishedStatus.message as string}
              </p>
            )}
          </div>

          <div className="flex gap-4 items-center justify-center">
            <Button disabled={isLoading} type="submit">
              {productId ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </SectionContentWrapper>
    </>
  );
};

export default Published;

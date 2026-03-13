"use client";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateCategoryMutation } from "@/redux/features/category/categoryApi";
import { TErrorResponse, TSuccessResponse } from "@/types/response";
import { revalidateTag } from "@/utilities/revalidate";
import { useEffect, useState } from "react";
import { TCategories } from "../lib/category.interface";

const CategoryStatusAction = ({ category }: { category: TCategories }) => {
  const { toast } = useToast();
  const [isChecked, setIsChecked] = useState(category?.isActive);

  useEffect(() => {
    setIsChecked(category?.isActive);
  }, [category?.isActive]);

  const [updateCategory] = useUpdateCategoryMutation();

  const handleChange = async () => {
    const updatedData = !isChecked;
    setIsChecked(updatedData);
    try {
      const res = (await updateCategory({
        data: { isActive: updatedData },
        id: category._id,
      }).unwrap()) as TSuccessResponse;
      if (res.success) {
        toast({
          className: "toast-success",
          title: res?.message,
        });
        await revalidateTag(["categories"]);
      }
    } catch (error) {
      const err = (error as { data: TErrorResponse })?.data;
      toast({
        className: "toast-error",
        title: err?.message || "Failed to update status",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch checked={isChecked} onCheckedChange={handleChange} />
    </div>
  );
};

export default CategoryStatusAction;

import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { TErrorResponse, TSuccessResponse } from "@/types/response";
import { useState, useEffect } from "react";
import { TSubCategories } from "./SubCategoryTable";
import { useUpdateCategoryMutation } from "@/redux/features/category/categoryApi";
import { revalidateTag } from "@/utilities/revalidate";

const UpdateSubCategoryActiveStatus = ({
  subcategory,
}: {
  subcategory: TSubCategories;
}) => {
  const { toast } = useToast();
  const [isChecked, setIsChecked] = useState(subcategory?.isActive);

  useEffect(() => {
    setIsChecked(subcategory?.isActive);
  }, [subcategory?.isActive]);

  const [updateCategory] = useUpdateCategoryMutation();

  const handleChange = async () => {
    const updatedData = !isChecked;
    setIsChecked(updatedData);
    try {
      const res = (await updateCategory({
        data: { isActive: updatedData },
        id: subcategory._id,
      }).unwrap()) as TSuccessResponse;
      if (res.success) {
        toast({
          className: "toast-success",
          title: res?.message,
        });
        await revalidateTag(["allCategories", "parentCategory"]);
      }
    } catch (error) {
      const err = (error as { data: TErrorResponse })?.data;
      toast({
        className: "toast-error",
        title: err?.message || "Failed to update status",
      });
      setIsChecked(!updatedData);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch checked={isChecked} onClick={handleChange} />
    </div>
  );
};

export default UpdateSubCategoryActiveStatus;

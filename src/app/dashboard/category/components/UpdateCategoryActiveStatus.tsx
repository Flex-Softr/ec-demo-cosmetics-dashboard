import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateCategoryMutation } from "@/redux/features/category/categoryApi";
import { TErrorResponse, TSuccessResponse } from "@/types/response";
import { revalidateTag } from "@/utilities/revalidate";
import { useState } from "react";
import { TCategories } from "./CategoryTable";

const UpdateCategoryActiveStatus = ({
  category,
}: {
  category: TCategories;
}) => {
  const { toast } = useToast();
  const [isChecked, setIsChecked] = useState(category?.isActive);

  const [updateCategoryFN] = useUpdateCategoryMutation();

  const handleChange = async () => {
    const updatedData = !isChecked;
    setIsChecked(updatedData);
    try {
      const res = (await updateCategoryFN({
        data: { isActive: updatedData },
        id: category._id,
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

export default UpdateCategoryActiveStatus;

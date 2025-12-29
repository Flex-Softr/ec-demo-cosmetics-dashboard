import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateSubCategoryMutation } from "@/redux/features/category/subCategoryApi";
import { TErrorResponse, TSuccessResponse } from "@/types/response/response";
import { refetchData } from "@/utilities/fetchData";
import { useState } from "react";
import { TSubCategories } from "./SubCategoryTable";

const UpdateSubCategoryActiveStatus = ({
  subcategory,
}: {
  subcategory: TSubCategories;
}) => {
  const { toast } = useToast();
  const [isChecked, setIsChecked] = useState(subcategory?.isActive);

  const [updateSubCategory] = useUpdateSubCategoryMutation();

  const handleChange = async () => {
    const updatedData = !isChecked;
    setIsChecked(updatedData);
    try {
      const res = (await updateSubCategory({
        data: { isActive: updatedData },
        id: subcategory._id,
      }).unwrap()) as TSuccessResponse;
      if (res.success) {
        await refetchData("categories");
        await refetchData("subcategories");
        toast({
          className: "toast-success",
          title: res?.message,
        });
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

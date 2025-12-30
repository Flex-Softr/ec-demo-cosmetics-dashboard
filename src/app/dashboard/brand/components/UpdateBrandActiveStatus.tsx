import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateBrandMutation } from "@/redux/features/brand/brandApi";
import { TErrorResponse, TSuccessResponse } from "@/types/response";
import { refetchData } from "@/utilities/fetchData";
import { useState } from "react";
import { TBrand } from "../lib/brand.interface";

const UpdateBrandActiveStatus = ({ brand }: { brand: TBrand }) => {
  const { toast } = useToast();
  const [isChecked, setIsChecked] = useState(brand?.isActive);

  const [updateBrandFN] = useUpdateBrandMutation();

  const handleChange = async () => {
    const updatedData = !isChecked;
    setIsChecked(updatedData);
    try {
      const res = (await updateBrandFN({
        data: { isActive: updatedData },
        id: brand._id,
      }).unwrap()) as TSuccessResponse;
      if (res.success) {
        refetchData("brands");
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

export default UpdateBrandActiveStatus;

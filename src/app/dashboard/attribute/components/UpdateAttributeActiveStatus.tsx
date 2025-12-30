import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateAttributeMutation } from "@/redux/features/addAttributes/attributesApi";
import { TErrorResponse, TSuccessResponse } from "@/types/response";
import { useState } from "react";
import { TAttribute } from "../lib/attribute.interface";

const UpdateAttributeActiveStatus = ({
  attribute,
}: {
  attribute: TAttribute;
}) => {
  const { toast } = useToast();
  const [isChecked, setIsChecked] = useState(attribute?.isActive);

  const [updateAttributeFN] = useUpdateAttributeMutation();

  const handleChange = async () => {
    const updatedData = !isChecked;
    setIsChecked(updatedData);
    try {
      const res = (await updateAttributeFN({
        data: { isActive: updatedData },
        id: attribute._id,
      }).unwrap()) as TSuccessResponse;
      if (res.success) {
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

export default UpdateAttributeActiveStatus;

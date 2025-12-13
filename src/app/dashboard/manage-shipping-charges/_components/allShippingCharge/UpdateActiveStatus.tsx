import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateShippingChargeMutation } from "@/redux/features/shippingCharge/shippingCharge";
import { TShippingCharge } from "@/redux/features/shippingCharge/shippingChargeInterface";
import { TErrorResponse, TSuccessResponse } from "@/types/response/response";
import { useState } from "react";

const UpdateActiveStatus = ({
  shippingCharge,
}: {
  shippingCharge: TShippingCharge;
}) => {
  const { toast } = useToast();
  const [isChecked, setIsChecked] = useState(shippingCharge?.isActive);

  const [updateShippingFN] = useUpdateShippingChargeMutation();

  const handleChange = async () => {
    const updatedData = !isChecked;
    setIsChecked(updatedData);
    try {
      const res = (await updateShippingFN({
        isActive: updatedData,
        id: shippingCharge._id,
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
        title: err?.message,
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch checked={isChecked} onClick={handleChange} />
    </div>
  );
};

export default UpdateActiveStatus;

import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateCouponsMutation } from "@/redux/features/coupon/couponApi";
import { TCoupon } from "@/redux/features/coupon/couponInterface";
import { TErrorResponse, TSuccessResponse } from "@/types/response/response";
import { useState } from "react";

const UpdateActiveStatus = ({ coupon }: { coupon: TCoupon }) => {
  const { toast } = useToast();
  const [isChecked, setIsChecked] = useState(coupon?.isActive);

  const [updateStatusFN] = useUpdateCouponsMutation();

  const handleChange = async () => {
    const updatedData = !isChecked;
    setIsChecked(updatedData);
    try {
      const res = (await updateStatusFN({
        isActive: updatedData,
        id: coupon._id,
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

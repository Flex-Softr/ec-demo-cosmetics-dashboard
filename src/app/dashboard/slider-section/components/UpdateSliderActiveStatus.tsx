import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

import { useUpdateSliderMutation } from "@/redux/features/sliderBanner/sliderApi";
import { TErrorResponse } from "@/types/response/response";
import { refetchData } from "@/utilities/fetchData";
import { useState } from "react";
import { TSlider } from "./SliderMediaTable";

const UpdateSliderActiveStatus = ({ slider }: { slider: TSlider }) => {
  const { toast } = useToast();
  const [isChecked, setIsChecked] = useState(slider?.isActive);

  const [updateSlider] = useUpdateSliderMutation();

  const handleChange = async () => {
    const updatedData = !isChecked;
    setIsChecked(updatedData);
    try {
      const res = await updateSlider({
        isActive: updatedData,
        id: slider._id,
      }).unwrap();

      if (res.success) {
        refetchData("sliders");
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

export default UpdateSliderActiveStatus;

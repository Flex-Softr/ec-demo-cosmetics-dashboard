import { useToast } from "@/components/ui/use-toast";

import { useDeleteSliderMutation } from "@/redux/features/sliderBanner/sliderApi";
import { TErrorResponse } from "@/types/response/response";
import { refetchData } from "@/utilities/fetchData";
import { Trash2Icon } from "lucide-react";
import { TSlider } from "./SliderMediaTable";

const DeleteSlider = ({ slider }: { slider: TSlider }) => {
  const { toast } = useToast();

  const [deleteSlider] = useDeleteSliderMutation();

  const handleChange = async () => {
    try {
      const res = await deleteSlider(slider._id).unwrap();

      if (res.success) {
        toast({
          className: "toast-success",
          title: res?.message,
        });
        refetchData("sliders");
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
      <Trash2Icon
        onClick={handleChange}
        className="text-red-500 cursor-pointer"
      />
    </div>
  );
};

export default DeleteSlider;

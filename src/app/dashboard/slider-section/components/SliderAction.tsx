"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import CommonAlertDialog from "@/components/common/CommonAlertDialog";
import { useDeleteSliderMutation } from "@/redux/features/sliderBanner/sliderApi";
import { TErrorResponse } from "@/types/response";
import { revalidateTag } from "@/utilities/revalidate";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { TSlider } from "../lib/slider.interface";
import UpdateSlider from "./UpdateSlider";

const SliderAction = ({ slider }: { slider: TSlider }) => {
  const { toast } = useToast();
  const [deleteSlider, { isLoading }] = useDeleteSliderMutation();
  const [alertOpen, setAlertOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await deleteSlider(slider._id).unwrap();
      if (res.success) {
        toast({ className: "toast-success", title: res?.message });
        await revalidateTag("sliderBanner");
      }
    } catch (error) {
      const err = (error as { data: TErrorResponse })?.data;
      toast({ className: "toast-error", title: err?.message });
    }
  };

  return (
    <div className="flex items-center gap-2 justify-center">
      {/* Edit */}
      <UpdateSlider slider={slider} />

      {/* Delete with CommonAlertDialog */}
      <Button
        variant="ghost"
        size="icon"
        className="!bg-white hover:!bg-gray-100"
        onClick={() => setAlertOpen(true)}
      >
        <Trash2Icon className="h-4 w-4 text-red-600" />
      </Button>

      <CommonAlertDialog
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title="Delete Slider?"
        description={`Are you sure you want to delete "${slider.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={isLoading}
        confirmText="Delete"
      />
    </div>
  );
};

export default SliderAction;

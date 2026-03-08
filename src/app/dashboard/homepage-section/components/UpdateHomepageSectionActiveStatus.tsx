"use client";

import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useUpdateHomepageSectionMutation } from "@/redux/features/homepageSection/homepageSectionApi";
import { THomePageSection } from "@/types/homepageSection";
import { revalidateTag } from "@/utilities/revalidate";
import { useState } from "react";

const UpdateHomepageSectionActiveStatus = ({
  homepageSection,
}: {
  homepageSection: THomePageSection;
}) => {
  const [isChecked, setIsChecked] = useState(homepageSection?.isActive);
  const [updateHomepageSection, { isLoading }] =
    useUpdateHomepageSectionMutation();

  const handleChange = async () => {
    const updatedStatus = !isChecked;
    setIsChecked(updatedStatus);
    try {
      const res = await updateHomepageSection({
        id: homepageSection._id,
        data: {
          isActive: updatedStatus,
        },
      }).unwrap();

      if (res.success) {
        toast({
          className: "bg-success text-white",
          title: res?.message || "Status updated successfully",
        });
        await revalidateTag([
          `homepageSections-${homepageSection._id}`,
          "homepageSections",
        ]);
      }
    } catch (error: unknown) {
      setIsChecked(isChecked); // revert on error
      const err = error as { data?: { message?: string } };
      toast({
        variant: "destructive",
        title: err?.data?.message || "Failed to update status",
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Switch
        checked={isChecked}
        onCheckedChange={handleChange}
        disabled={isLoading}
      />
    </div>
  );
};

export default UpdateHomepageSectionActiveStatus;

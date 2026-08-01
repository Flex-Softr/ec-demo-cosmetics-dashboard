"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Label } from "@/components/ui/label";
import MultiSelect from "@/components/ui/multi-select";
import { setTag } from "@/redux/features/addProduct/addProductSlice";
import { TSelectValue } from "@/redux/features/addProduct/variation/interface";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const Tag = ({ tags }: { tags: TSelectValue[] }) => {
  const dispatch = useAppDispatch();
  const selectedTags = useAppSelector(({ addProduct }) => addProduct.tag);

  return (
    <SectionContentWrapper heading="Product tags">
      <div className="space-y-1">
        <Label>Select tag</Label>
        <MultiSelect
          options={tags.map((tag) => ({
            label: tag.label,
            value: String(tag.value),
          }))}
          value={selectedTags?.map((tag) => ({
            label: tag.label,
            value: String(tag.value),
          }))}
          onChange={(value) => {
            dispatch(
              setTag(
                value.map((item) => ({
                  label: item.label,
                  value: item.value,
                }))
              )
            );
          }}
          placeholder="Select tag..."
        />
      </div>
    </SectionContentWrapper>
  );
};

export default Tag;

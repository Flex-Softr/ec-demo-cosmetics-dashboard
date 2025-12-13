"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Label } from "@/components/ui/label";
import Select, { MultiValue } from "react-select";
import { setTag } from "@/redux/features/addProduct/addProductSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TSelectValue } from "@/redux/features/addProduct/variation/interface";

const Tag = ({ tags }: { tags: TSelectValue[] }) => {
  const dispatch = useAppDispatch();
  const selectedTags = useAppSelector(({ addProduct }) => addProduct.tag);

  const handleAttribute = (value: MultiValue<TSelectValue>) => {
    const mutableValue: TSelectValue[] = Array.from(value);
    dispatch(setTag(mutableValue));
  };

  return (
    <SectionContentWrapper heading="Product tags">
      <div className="space-y-1">
        <Label>Select tag</Label>
        <Select
          isMulti
          isSearchable
          options={tags}
          defaultValue={selectedTags}
          onChange={handleAttribute}
          placeholder="Select tag..."
        />
      </div>
    </SectionContentWrapper>
  );
};

export default Tag;

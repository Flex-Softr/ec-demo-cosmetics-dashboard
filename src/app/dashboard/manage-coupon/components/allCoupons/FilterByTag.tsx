"use client";

import { Button } from "@/components/ui/button";
import { useGetAllCouponTagsQuery } from "@/redux/features/coupon/couponApi";
import { setCouponSelectedTags } from "@/redux/features/coupon/couponSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useState } from "react";
import Select from "react-select";
import { TSelectOption } from "../CouponCategoryProductCondition";

const FilterByTag = () => {
  const [selectedValue, setSelectedValue] = useState<TSelectOption>([]);

  const { data: tagRes } = useGetAllCouponTagsQuery({});
  const tag = (tagRes?.data?.tags as string[]) || [];
  const options = tag.map((item) => ({ value: item, label: item }));

  const dispatch = useAppDispatch();

  return (
    <div className="flex w-full max-w-md items-center gap-2 sm:w-[420px]">
      <Select
        options={options}
        isMulti={true}
        placeholder="Filter by tags"
        className="w-full text-sm"
        onChange={(v) => setSelectedValue(v)}
        value={selectedValue}
        isClearable={false}
        classNames={{
          control: () => "!min-h-10 !rounded-lg !border-border",
        }}
      />
      <Button
        size="sm"
        className="rounded-lg shrink-0"
        onClick={() =>
          dispatch(
            setCouponSelectedTags(selectedValue.map((item) => item.value))
          )
        }
      >
        Filter
      </Button>
      {selectedValue.length ? (
        <Button
          size="sm"
          variant="destructive"
          className="rounded-lg shrink-0"
          onClick={() => {
            dispatch(setCouponSelectedTags([]));
            setSelectedValue([]);
          }}
        >
          Clear
        </Button>
      ) : null}
    </div>
  );
};

export default FilterByTag;

import EcButton from "@/components/EcButton/EcButton";
import { useGetAllCouponTagsQuery } from "@/redux/features/coupon/couponApi";
import { setCouponSelectedTags } from "@/redux/features/coupon/couponSlice";
import { useState } from "react";

import { useAppDispatch } from "@/redux/hooks";
import Select from "react-select";
import { TSelectOption } from "../createCoupons/CouponCategoryProductCondition";

const FilterByTag = () => {
  const [selectedValue, setSelectedValue] = useState<TSelectOption>([]);

  const { data: tagRes } = useGetAllCouponTagsQuery({});
  const tag = (tagRes?.data?.tags as string[]) || [];
  const options = tag.map((item) => ({ value: item, label: item }));

  const dispatch = useAppDispatch();

  return (
    <div className="w-[550px] flex gap-3">
      <Select
        options={options}
        isMulti={true}
        placeholder="Filter by tags"
        className="w-full"
        onChange={(v) => setSelectedValue(v)}
        value={selectedValue}
        isClearable={false}
      />
      <EcButton
        onClick={() =>
          dispatch(
            setCouponSelectedTags(selectedValue.map((item) => item.value))
          )
        }
      >
        Filter
      </EcButton>
      {selectedValue.length ? (
        <EcButton
          variant={"destructive"}
          onClick={() => {
            dispatch(setCouponSelectedTags([]));
            setSelectedValue([]);
          }}
        >
          Clear
        </EcButton>
      ) : null}
    </div>
  );
};

export default FilterByTag;

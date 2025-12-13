"use client";

import { setSelectedTimes } from "@/redux/features/customers/customersSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const FilterByTimes = () => {
  const dispatch = useAppDispatch();
  const { selectedTimes } = useAppSelector(({ customers }) => customers);
  const data = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  return (
    <div>
      <select
        onChange={(e) => dispatch(setSelectedTimes(e.target.value))}
        value={selectedTimes}
        className="w-40 h-9 border border-primary outline-primary rounded-md"
      >
        <option value="">-- Select Times --</option>
        {data.map((item, index) => (
          <option value={item} key={index}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterByTimes;

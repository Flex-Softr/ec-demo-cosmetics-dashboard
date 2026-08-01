"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setSelectedTimes } from "@/redux/features/completedOrders/completedOrdersSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const ALL_VALUE = "all";
const TIMES = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

const FilterByTimes = () => {
  const dispatch = useAppDispatch();
  const { selectedTimes } = useAppSelector(
    ({ completedOrders }) => completedOrders
  );

  return (
    <Select
      value={selectedTimes ? String(selectedTimes) : ALL_VALUE}
      onValueChange={(value) =>
        dispatch(
          setSelectedTimes(value === ALL_VALUE ? undefined : Number(value))
        )
      }
    >
      <SelectTrigger className="h-10 w-40 rounded-lg">
        <SelectValue placeholder="Select Times" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>All Times</SelectItem>
        {TIMES.map((item) => (
          <SelectItem value={String(item)} key={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterByTimes;

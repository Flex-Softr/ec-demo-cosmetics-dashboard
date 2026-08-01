"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orderSources } from "@/const/ordersSource";
import { setSelectedSource } from "@/redux/features/completedOrders/completedOrdersSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const ALL_VALUE = "all";

const FilterBySource = () => {
  const dispatch = useAppDispatch();
  const { selectedSource } = useAppSelector(
    ({ completedOrders }) => completedOrders
  );

  return (
    <Select
      value={selectedSource || ALL_VALUE}
      onValueChange={(value) =>
        dispatch(setSelectedSource(value === ALL_VALUE ? "" : value))
      }
    >
      <SelectTrigger className="h-10 w-44 rounded-lg">
        <SelectValue placeholder="Select Source" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>All Sources</SelectItem>
        {orderSources.map((source) => (
          <SelectItem value={source} key={source} className="capitalize">
            {source}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterBySource;

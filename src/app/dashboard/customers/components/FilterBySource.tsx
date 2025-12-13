"use client";

import { setSelectedSource } from "@/redux/features/customers/customersSlice";
import { useGetOrdersByPlatformCountQuery } from "@/redux/features/reports/reportsApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const FilterBySource = () => {
  const dispatch = useAppDispatch();
  const { selectedSource } = useAppSelector(({ customers }) => customers);

  const { data, isLoading } = useGetOrdersByPlatformCountQuery({
    type: "allTime",
  });

  return (
    <div>
      <select
        onChange={(e) => dispatch(setSelectedSource(e.target.value))}
        value={selectedSource}
        className="w-44 h-9 border border-primary outline-primary rounded-md"
        disabled={isLoading}
      >
        <option value="">-- Select Source --</option>
        {data?.data?.length &&
          data?.data.map(({ source }: { source: string }) => (
            <option value={source} key={source}>
              {source}
            </option>
          ))}
      </select>
    </div>
  );
};

export default FilterBySource;

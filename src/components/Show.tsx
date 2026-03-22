"use client";
import CommonSelect from "./commonSelect/CommonSelect";
import { setLimit } from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const Show = ({ className }: { className?: string }) => {
  const dispatch = useAppDispatch();
  const { limit } = useAppSelector(({ pagination }) => pagination);

  const options = [
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "30", value: "30" },
    { label: "40", value: "40" },
    { label: "50", value: "50" },
  ];

  return (
    <div
      className={`flex items-center gap-1 text-muted-foreground ${className}`}
    >
      <span>Show</span>
      <CommonSelect
        options={options}
        value={String(limit)}
        onChange={(v) => dispatch(setLimit(parseInt(v)))}
        className="w-[70px] border-primary"
      />
    </div>
  );
};

export default Show;

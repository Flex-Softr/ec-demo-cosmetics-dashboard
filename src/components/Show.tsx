"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setLimit } from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const Show = ({ className }: { className?: string }) => {
  const dispatch = useAppDispatch();
  const { limit } = useAppSelector(({ pagination }) => pagination);

  const options = ["10", "20", "30", "40", "50"];

  return (
    <div
      className={`flex items-center gap-1.5 text-sm text-muted-foreground ${className || ""}`}
    >
      <span>Show</span>
      <Select
        value={String(limit)}
        onValueChange={(value) => dispatch(setLimit(parseInt(value, 10)))}
      >
        <SelectTrigger className="h-10 w-[70px] rounded-lg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Show;

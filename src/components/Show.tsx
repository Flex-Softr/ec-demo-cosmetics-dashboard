"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setLimit } from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const Show = ({ className }: { className?: string }) => {
  const dispatch = useAppDispatch();
  const { limit } = useAppSelector(({ pagination }) => pagination);

  return (
    <div
      className={`flex items-center gap-1 text-muted-foreground ${className}`}
    >
      <span>Show</span>
      <Select onValueChange={(v) => dispatch(setLimit(parseInt(v)))}>
        <SelectTrigger className="w-[60px] border-primary focus:ring-primary focus:ring-1">
          <SelectValue placeholder={limit} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="capitalize">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="40">40</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Show;

"use client";
import { Button } from "@/components/ui/button";
import {
  setLimit,
  setPage,
  setTotalPage,
} from "@/redux/features/pagination/PaginationSlice";
import { setSelectedStatus } from "@/redux/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import backgroundColor from "@/utilities/backgroundColor";
import borderColor from "@/utilities/borderColor";

const CountByStatusButtons = () => {
  const dispatch = useAppDispatch();
  const { limit, isLoading } = useAppSelector(({ pagination }) => pagination);
  const { selectedStatus: filter, countsByStatus } = useAppSelector(
    ({ products }) => products
  );

  return (
    <div className="flex flex-wrap items-center justify-start gap-5">
      {countsByStatus?.map((status: { name: string; total: number }) => {
        const bg = `${backgroundColor(status.name)} text-white`;
        return (
          <Button
            key={status.name}
            onClick={() => {
              dispatch(setTotalPage({ total: status.total }));
              dispatch(setLimit(limit));
              dispatch(setSelectedStatus(status.name));
              dispatch(setPage(1));
            }}
            disabled={isLoading}
            className={`capitalize bg-white flex items-center gap-1 rounded-2xl ${borderColor(
              status.name
            )
              .split(" ")
              .filter((c) => !c.startsWith("text-"))
              .join(" ")} ${filter === status.name ? bg : "text-black"}`}
          >
            <span>{status.name}</span>
            <span>({status.total})</span>
          </Button>
        );
      })}
    </div>
  );
};

export default CountByStatusButtons;

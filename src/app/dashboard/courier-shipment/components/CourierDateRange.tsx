"use client";
import DateRangeSelector, {
  TDateRangeSelectorHandlerFN,
} from "@/components/DateRangeSelector";
import { setDate } from "@/redux/features/orders/ordersSlice";
import { useAppDispatch } from "@/redux/hooks";

const ProcessingOrderDateRange = () => {
  const dispatch = useAppDispatch();
  const handlerFN = (payload: TDateRangeSelectorHandlerFN) => {
    const { start, end } = payload;
    dispatch(
      setDate({
        startFrom: start,
        endAt: end,
      })
    );
  };
  return <DateRangeSelector handlerFN={handlerFN} />;
};

export default ProcessingOrderDateRange;

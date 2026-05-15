"use client";
import { setSelectedCourierId } from "@/redux/features/monitorDelivery/monitorDeliverySlice";
import { setPage } from "@/redux/features/pagination/PaginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { TCourierCount } from "@/redux/features/monitorDelivery/monitorDeliveryInterface";

const CourierFilter = () => {
  const dispatch = useAppDispatch();

  const { countsByCourier, selectedCourierId } = useAppSelector(
    ({ monitorDelivery }) => monitorDelivery
  );

  if (!countsByCourier || countsByCourier.length === 0) return null;

  return (
    <div className="flex items-center gap-2 ml-auto">
      <label
        htmlFor="courier-filter"
        className="text-sm font-medium whitespace-nowrap text-muted-foreground"
      >
        Courier:
      </label>
      <select
        id="courier-filter"
        value={selectedCourierId}
        onChange={(e) => {
          dispatch(setPage(1));
          dispatch(setSelectedCourierId(e.target.value));
        }}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-primary capitalize"
      >
        <option value="">All Couriers</option>
        {countsByCourier.map((courier: TCourierCount) => (
          <option key={courier._id} value={courier._id}>
            {courier.name} ({courier.total})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CourierFilter;

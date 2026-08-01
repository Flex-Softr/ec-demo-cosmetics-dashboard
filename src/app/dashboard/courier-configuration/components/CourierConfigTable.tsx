"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllCouriersQuery } from "@/redux/features/courierConfiguration/courierConfigurationApi";
import { TCourierConfig } from "@/redux/features/courierConfiguration/courierConfigurationInterface";
import { setSelectedCourier } from "@/redux/features/courierConfiguration/courierConfigurationSlice";
import { useAppDispatch } from "@/redux/hooks";
import { PencilLine } from "lucide-react";

export default function CourierConfigTable({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { data } = useGetAllCouriersQuery();

  const dispatch = useAppDispatch();

  const couriers = data?.data || [];

  const handleEdit = (courier: TCourierConfig) => {
    dispatch(setSelectedCourier(courier));
    setIsOpen(true);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow className="border-b border-border hover:bg-muted">
            <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Courier Name
            </TableHead>
            <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {couriers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="h-24 text-center text-muted-foreground"
              >
                No couriers configured.
              </TableCell>
            </TableRow>
          ) : (
            couriers.map((courier) => (
              <TableRow key={courier._id} className="border-b border-border">
                <TableCell className="py-3 font-semibold text-foreground">
                  {courier.name}
                </TableCell>
                <TableCell className="py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      courier.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {courier.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(courier)}
                    className="h-7 w-7 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  >
                    <PencilLine className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

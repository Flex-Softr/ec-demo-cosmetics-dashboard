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
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-primary text-white">
          <TableRow>
            {/* <TableHead className="w-20">Thumb</TableHead> */}
            <TableHead>Courier Name</TableHead>
            {/* <TableHead>API Base URL</TableHead> */}
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {couriers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No couriers configured.
              </TableCell>
            </TableRow>
          ) : (
            couriers.map((courier) => (
              <TableRow key={courier._id}>
                {/* <TableCell>
                  <div className="relative w-10 h-10 rounded border overflow-hidden bg-gray-50 flex items-center justify-center">
                    {courier.thumb ? (
                      <Image
                        src={formatImageSrc(courier.thumb)}
                        alt={courier.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400">No img</span>
                    )}
                  </div>
                </TableCell> */}
                <TableCell className="font-medium">{courier.name}</TableCell>
                {/* <TableCell>{courier.apiBaseUrl}</TableCell> */}
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      courier.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {courier.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(courier)}
                    className="!bg-white hover:!bg-white rounded-full"
                  >
                    <PencilLine className="h-4 w-4 text-green-600" />
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

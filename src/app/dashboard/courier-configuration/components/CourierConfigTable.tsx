"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  useDeleteCourierMutation,
  useGetAllCouriersQuery,
} from "@/redux/features/courierConfiguration/courierConfigurationApi";
import { TCourierConfig } from "@/redux/features/courierConfiguration/courierConfigurationInterface";
import { setSelectedCourier } from "@/redux/features/courierConfiguration/courierConfigurationSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Edit, Trash2 } from "lucide-react";

export default function CourierConfigTable({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { data } = useGetAllCouriersQuery();
  const [deleteCourier] = useDeleteCourierMutation();
  const dispatch = useAppDispatch();

  const { toast } = useToast();
  const couriers = data?.data || [];

  const handleEdit = (courier: TCourierConfig) => {
    dispatch(setSelectedCourier(courier));
    setIsOpen(true);
  };

  const confirmDelete = async (id: string) => {
    try {
      const res = await deleteCourier(id).unwrap();
      toast({
        className: "bg-success text-white text-2xl",
        title: res.message,
      });
    } catch (error) {
      toast({
        title: "Failed to delete courier.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-primary text-white">
          <TableRow>
            <TableHead>Courier Name</TableHead>
            <TableHead>API Base URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {couriers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No couriers configured.
              </TableCell>
            </TableRow>
          ) : (
            couriers.map((courier) => (
              <TableRow key={courier._id}>
                <TableCell className="font-medium">{courier.name}</TableCell>
                <TableCell>{courier.apiBaseUrl}</TableCell>
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
                    className="!bg-white hover:!bg-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="!bg-white hover:!bg-white"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You won&apos;t be able to revert this!
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => confirmDelete(courier._id)}
                        >
                          Yes, delete it!
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

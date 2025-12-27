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
  useDeletePaymentMethodMutation,
  useGetPaymentMethodQuery,
} from "@/redux/features/paymentMethod/paymentMethodAPI";
import { TPaymentMethod } from "@/redux/features/paymentMethod/paymentMethodInterface";
import { setSelectedPaymentMethod } from "@/redux/features/paymentMethod/paymentMethodSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Edit, Trash2 } from "lucide-react";

export default function PaymentConfigTable({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { data: response, isLoading: isFetching } = useGetPaymentMethodQuery();
  const [deletePaymentMethod] = useDeletePaymentMethodMutation();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const paymentMethods = response?.data || [];

  const handleEdit = (paymentMethod: TPaymentMethod) => {
    dispatch(setSelectedPaymentMethod(paymentMethod));
    setIsOpen(true);
  };

  const confirmDelete = async (id: string) => {
    try {
      const res = await deletePaymentMethod(id).unwrap();
      toast({
        className: "bg-success text-white text-2xl",
        title: res.message || "Payment method deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to delete payment method.",
        variant: "destructive",
      });
    }
  };

  if (isFetching) {
    return <div className="p-8 text-center">Loading payment methods...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-primary text-white hover:!bg-primary">
          <TableRow className="hover:!bg-primary">
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-right text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentMethods.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No payment methods configured.
              </TableCell>
            </TableRow>
          ) : (
            paymentMethods.map((method) => (
              <TableRow key={method._id}>
                <TableCell className="font-medium">{method.name}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      method.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {method.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(method)}
                    className="!bg-white hover:!bg-gray-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="!bg-white hover:!bg-gray-100"
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
                          onClick={() => confirmDelete(method._id)}
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

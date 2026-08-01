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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { formatImageSrc } from "@/lib/utils";
import {
  useDeletePaymentMethodMutation,
  useGetPaymentMethodQuery,
} from "@/redux/features/paymentMethod/paymentMethodAPI";
import { TPaymentMethod } from "@/redux/features/paymentMethod/paymentMethodInterface";
import { setSelectedPaymentMethod } from "@/redux/features/paymentMethod/paymentMethodSlice";
import { useAppDispatch } from "@/redux/hooks";
import { revalidateTag } from "@/utilities/revalidate";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

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

      await revalidateTag("paymentMethod");
    } catch (error) {
      toast({
        title: "Failed to delete payment method.",
        variant: "destructive",
      });
    }
  };

  if (isFetching) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table className="whitespace-nowrap">
        <TableHeader className="bg-muted">
          <TableRow className="border-b border-border hover:bg-muted">
            <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              SL
            </TableHead>
            <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Name
            </TableHead>
            <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Logo
            </TableHead>
            <TableHead className="py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Input Fields
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
          {paymentMethods.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                No payment methods configured.
              </TableCell>
            </TableRow>
          ) : (
            paymentMethods.map((method) => (
              <TableRow key={method._id} className="border-b border-border">
                <TableCell className="py-3">
                  {method.sortOrder ?? "—"}
                </TableCell>
                <TableCell className="py-3 font-semibold text-foreground">
                  {method.name}
                </TableCell>
                <TableCell className="py-3">
                  {method.logo?.src ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-border bg-muted">
                      <Image
                        src={formatImageSrc(method.logo.src)}
                        alt={method.logo?.alt || "logo"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="py-3 text-muted-foreground">
                  {method.required_inputs?.length
                    ? method.required_inputs
                        .map((input) => input.name)
                        .join(", ")
                    : "—"}
                </TableCell>
                <TableCell className="py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      method.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {method.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="space-x-0.5 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(method)}
                    className="h-7 w-7 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete payment method?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-lg">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="rounded-lg"
                          onClick={() => confirmDelete(method._id)}
                        >
                          Delete
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

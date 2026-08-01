"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateCouponsMutation } from "@/redux/features/coupon/couponApi";
import { TCoupon } from "@/redux/features/coupon/couponInterface";
import { TErrorResponse, TSuccessResponse } from "@/types/response";
import { Dispatch, SetStateAction } from "react";

const DeleteCoupon = ({
  coupon,
  open,
  setOpen,
}: {
  coupon: TCoupon;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const [updateStatusFN, { isLoading }] = useUpdateCouponsMutation();

  const handleDelete = async () => {
    try {
      const res = (await updateStatusFN({
        id: coupon._id,
        isDeleted: true,
      }).unwrap()) as TSuccessResponse;
      if (res.success) {
        setOpen(false);
        toast({
          className: "toast-success",
          title: res?.message,
        });
      }
    } catch (error) {
      const err = (error as { data: TErrorResponse })?.data;
      toast({
        className: "toast-error",
        title: err?.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <h1 className="text-lg font-semibold text-foreground">
          Delete Coupon?
        </h1>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-foreground">{coupon.code}</span>?
          This action cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" size="sm" className="rounded-lg">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            size="sm"
            className="rounded-lg"
            disabled={isLoading}
            onClick={handleDelete}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCoupon;

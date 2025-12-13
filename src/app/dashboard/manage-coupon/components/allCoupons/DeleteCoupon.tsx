import EcButton from "@/components/EcButton/EcButton";
import CommonModal from "@/components/modal/CommonModal";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateCouponsMutation } from "@/redux/features/coupon/couponApi";
import { TCoupon } from "@/redux/features/coupon/couponInterface";
import { TErrorResponse, TSuccessResponse } from "@/types/response/response";
import { Dispatch, SetStateAction } from "react";

const DeleteCoupon = ({
  coupon,
  handleOpen,
  open,
  setOpen,
}: {
  coupon: TCoupon;
  handleOpen: () => void;
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
    <>
      <div className="flex justify-center">
        <CommonModal
          open={open}
          handleOpen={handleOpen}
          className="h-[230px] w-[650px]"
          modalTitle="Are you sure?"
        >
          <div>
            <p>
              <span className="font-semibold">Coupon:</span> {coupon.code}
            </p>
            <p className="mt-5">
              This action cannot be undone. This will delete coupon.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <EcButton variant={"outline"} onClick={() => setOpen(false)}>
                Cancel
              </EcButton>
              <EcButton
                loading={isLoading}
                disabled={isLoading}
                onClick={() => handleDelete()}
              >
                Confirm
              </EcButton>
            </div>
          </div>
        </CommonModal>
      </div>
    </>
  );
};

export default DeleteCoupon;

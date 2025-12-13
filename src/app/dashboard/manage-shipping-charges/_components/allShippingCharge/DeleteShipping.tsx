import EcButton from "@/components/EcButton/EcButton";
import CommonModal from "@/components/modal/CommonModal";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateShippingChargeMutation } from "@/redux/features/shippingCharge/shippingCharge";
import { TShippingCharge } from "@/redux/features/shippingCharge/shippingChargeInterface";
import { TErrorResponse, TSuccessResponse } from "@/types/response/response";
import { Dispatch, SetStateAction } from "react";

const DeleteShipping = ({
  shippingCharge,
  handleOpen,
  open,
  setOpen,
}: {
  shippingCharge: TShippingCharge;
  handleOpen: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [updateShippingFN, { isLoading }] = useUpdateShippingChargeMutation();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const res = (await updateShippingFN({
        id: shippingCharge._id,
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
    <div className="flex justify-center">
      <CommonModal
        open={open}
        handleOpen={handleOpen}
        className="h-[200px] w-[650px]"
        modalTitle="Confirm to delete shipping charge"
      >
        <div className="flex flex-col gap-2">
          Are you sure you want to delete:{" "}
          <span className="font-semibold">
            {shippingCharge.name} - {shippingCharge.amount}
          </span>
        </div>
        <div className="flex justify-end gap-2">
          <EcButton
            className="bg-transparent"
            variant={"ghost"}
            onClick={() => setOpen(false)}
          >
            Cancel
          </EcButton>
          <EcButton
            onClick={handleDelete}
            loading={isLoading}
            disabled={isLoading}
            variant={"destructive"}
          >
            Confirm
          </EcButton>
        </div>
      </CommonModal>
    </div>
  );
};

export default DeleteShipping;

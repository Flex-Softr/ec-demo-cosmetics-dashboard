import CommonModal from "@/components/modal/CommonModal";
import { TShippingCharge } from "@/redux/features/shippingCharge/shippingChargeInterface";
import { Dispatch, SetStateAction } from "react";
import UpdateDetailsForm from "./UpdateDetailsForm";

const UpdateDetails = ({
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
  return (
    <>
      <div className="flex justify-center">
        <CommonModal
          open={open}
          handleOpen={handleOpen}
          className="h-[240px] w-[650px]"
          modalTitle="Edit shipping charge"
        >
          <UpdateDetailsForm
            shippingCharge={shippingCharge}
            setOpen={setOpen}
          />
        </CommonModal>
      </div>
    </>
  );
};

export default UpdateDetails;

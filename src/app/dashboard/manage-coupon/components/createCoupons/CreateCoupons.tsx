import EcButton from "@/components/EcButton/EcButton";
import CommonModal from "@/components/modal/CommonModal";
import { useState } from "react";
import CreateCouponForm from "./CreateCouponForm";

const CreateCoupons = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen((prev) => !prev);

  return (
    <div>
      <EcButton onClick={() => setOpen(true)}>Create coupon</EcButton>
      <CommonModal
        open={open}
        handleOpen={handleOpen}
        className="min-h-[600px] w-full"
        modalTitle="Create new coupon"
      >
        <CreateCouponForm />
      </CommonModal>
    </div>
  );
};

export default CreateCoupons;

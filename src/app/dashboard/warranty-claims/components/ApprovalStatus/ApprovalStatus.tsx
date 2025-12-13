"use client";
import CommonModal from "@/components/modal/CommonModal";
import { TWarrantyClaim } from "@/redux/features/warrantyClaimRequests/warrantyClaimInterface";
import backgroundColor from "@/utilities/backgroundColor";
import { useState } from "react";
import UpdateApprovalStatus from "./UpdateApprovalStatus";

const ApprovalStatus = ({ reqData }: { reqData: TWarrantyClaim }) => {
  const approvalStatus = reqData.approvalStatus || "pending";
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <div>
      <button
        onClick={handleOpen}
        disabled={reqData.result !== "problem"}
        className={`capitalize px-2 pb-[2px] pt-[1px] rounded text-white ${backgroundColor(approvalStatus as string)}`}
      >
        {approvalStatus}
      </button>
      <CommonModal
        open={open}
        handleOpen={handleOpen}
        className="h-[450px] w-10/12"
        modalTitle="Approve and create new order"
      >
        <div>
          <span>Current status : </span>
          <span
            className={`capitalize px-2 pb-[2px] pt-[1px] rounded text-white ${backgroundColor(approvalStatus as string)}`}
          >
            {approvalStatus}
          </span>
          <UpdateApprovalStatus _id={reqData._id} setOpen={setOpen} />
        </div>
      </CommonModal>
    </div>
  );
};

export default ApprovalStatus;

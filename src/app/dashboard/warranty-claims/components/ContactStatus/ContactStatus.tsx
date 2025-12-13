"use client";
import CommonModal from "@/components/modal/CommonModal";
import { TWarrantyClaimContactStatus } from "@/redux/features/warrantyClaimRequests/warrantyClaimInterface";
import backgroundColor from "@/utilities/backgroundColor";
import { useState } from "react";
import UpdateWarrantyClaimContactStatus from "./UpdateWarrantyClaimContactStatus";
type TProps = {
  _id: string;
  contactStatus: TWarrantyClaimContactStatus;
};

const ContactStatus = ({ _id, contactStatus }: TProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <div>
      <button
        onClick={handleOpen}
        // disabled={notDisable ? false : isDisable}
        className={`capitalize px-2 pb-[2px] pt-[1px] rounded text-white ${backgroundColor(contactStatus)}`}
      >
        {contactStatus}
      </button>
      <CommonModal
        open={open}
        handleOpen={handleOpen}
        className="h-[180px] w-[400px]"
        modalTitle="Update contact status"
      >
        <div>
          <span>Current status : </span>
          <span
            className={`capitalize px-2 pb-[2px] pt-[1px] rounded text-white ${backgroundColor(contactStatus)}`}
          >
            {contactStatus}
          </span>
        </div>
        <UpdateWarrantyClaimContactStatus
          contactStatus={contactStatus}
          _id={_id}
          setOpen={setOpen}
        />
      </CommonModal>
    </div>
  );
};

export default ContactStatus;

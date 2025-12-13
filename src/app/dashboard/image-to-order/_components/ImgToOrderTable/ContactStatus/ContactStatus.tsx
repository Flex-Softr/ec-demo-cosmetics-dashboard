"use client";
import CommonModal from "@/components/modal/CommonModal";
import { TImageToOrderContactStatus } from "@/redux/features/imageToOrder/imageToOrderInterface";
import backgroundColor from "@/utilities/backgroundColor";
import { useState } from "react";
import UpdateITOContactStatus from "./UpdateITOContactStatus";

const ContactStatus = ({
  contactStatus,
  _id,
}: {
  contactStatus: TImageToOrderContactStatus;
  _id: string;
}) => {
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
        <div className="space-y-4">
          <span>Current status : </span>
          <span
            className={`capitalize px-2 pb-[2px] pt-[1px] rounded text-white ${backgroundColor(contactStatus)}`}
          >
            {contactStatus}
          </span>
          <UpdateITOContactStatus
            contactStatus={contactStatus}
            _id={_id}
            setOpen={setOpen}
          />
        </div>
      </CommonModal>
    </div>
  );
};

export default ContactStatus;

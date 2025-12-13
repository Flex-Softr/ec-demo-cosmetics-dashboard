import CommonModal from "@/components/modal/CommonModal";
import { TImageToOrderStatus } from "@/redux/features/imageToOrder/imageToOrderInterface";
import backgroundColor from "@/utilities/backgroundColor";
import { useState } from "react";
import UpdateITOStatus from "./UpdateITOStatus";

const ITOStatus = ({
  currentStatus,
  _id,
}: {
  currentStatus: TImageToOrderStatus;
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
        className={`capitalize px-2 pb-[2px] pt-[1px] rounded text-white ${backgroundColor(currentStatus)}`}
      >
        {currentStatus}
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
            className={`capitalize px-2 pb-[2px] pt-[1px] rounded text-white ${backgroundColor(currentStatus)}`}
          >
            {currentStatus}
          </span>
          <UpdateITOStatus
            ITOStatus={currentStatus}
            _id={_id}
            setOpen={setOpen}
          />
        </div>
      </CommonModal>
    </div>
  );
};

export default ITOStatus;

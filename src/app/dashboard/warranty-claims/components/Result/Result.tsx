"use client";
import CommonModal from "@/components/modal/CommonModal";
import { TWarrantyClaim } from "@/redux/features/warrantyClaimRequests/warrantyClaimInterface";
import backgroundColor from "@/utilities/backgroundColor";
import { useState } from "react";
import UpdateResult from "./UpdateResult";

const Result = ({ reqData }: { reqData: TWarrantyClaim }) => {
  const result = reqData.result;
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        disabled={reqData.contactStatus !== "confirmed"}
        className={`capitalize px-2 pb-[2px] pt-[1px] rounded text-white ${backgroundColor(result)}`}
      >
        {result}
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
            className={`capitalize px-2 pb-[2px] pt-[1px] rounded text-white ${backgroundColor(result)}`}
          >
            {result}
          </span>
        </div>
        <UpdateResult
          warrantyClaimResult={result}
          _id={reqData._id}
          setOpen={setOpen}
        />
      </CommonModal>
    </div>
  );
};

export default Result;

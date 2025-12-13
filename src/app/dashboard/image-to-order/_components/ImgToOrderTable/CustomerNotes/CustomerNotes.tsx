"use client";
import CommonModal from "@/components/modal/CommonModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TImageToOrderReq } from "@/redux/features/imageToOrder/imageToOrderInterface";
import { useState } from "react";

const CustomerNotes = ({ reqData }: { reqData: TImageToOrderReq }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div>
      <Button
        onClick={handleOpen}
        className="bg-inherit text-inherit hover:bg-inherit relative"
        title={reqData.customerNotes}
      >
        Notes
        {reqData.customerNotes ? (
          <Badge className="w-3 h-3 rounded-full p-0 m-0 absolute -top-1 -right-1"></Badge>
        ) : (
          ""
        )}
      </Button>

      <CommonModal
        open={open}
        handleOpen={handleOpen}
        className="h-[230px] w-[400px]"
        modalTitle="Notes"
      >
        <div className="grid w-full gap-1.5">
          <Textarea
            id="customerNotes"
            className="min-h-20 border border-primary focus-visible:ring-primary cursor-not-allowed"
            defaultValue={reqData.customerNotes}
            readOnly
            disabled
          />
        </div>
      </CommonModal>
    </div>
  );
};

export default CustomerNotes;

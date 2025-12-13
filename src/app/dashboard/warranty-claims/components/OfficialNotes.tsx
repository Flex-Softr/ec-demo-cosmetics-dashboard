"use client";
import EcButton from "@/components/EcButton/EcButton";
import CommonModal from "@/components/modal/CommonModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useUpdateWarrantyClamReqMutation } from "@/redux/features/warrantyClaimRequests/warrantyClaimApi";
import { TWarrantyClaim } from "@/redux/features/warrantyClaimRequests/warrantyClaimInterface";
import { TErrorResponse, TSuccessResponse } from "@/types/response/response";
import { ChangeEvent, useState } from "react";

const OfficialNotes = ({ reqData }: { reqData: TWarrantyClaim }) => {
  const [updateClaimRequest] = useUpdateWarrantyClamReqMutation();

  const [open, setOpen] = useState(false);
  const [updatedNote, setUpdateNote] = useState<null | string>(null);
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };
  const handleNoteChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUpdateNote(e.target.value);
  };
  const handleClaimReqUpdate = async () => {
    const updateData = {
      id: reqData._id,
      officialNotes: updatedNote ? updatedNote : "",
    };

    try {
      const result = (await updateClaimRequest(
        updateData
      ).unwrap()) as TSuccessResponse;

      if (result.success) {
        setOpen(false);
        toast({
          className: "toast-success",
          title: result.message,
        });
      }
    } catch (error) {
      const err = error as { data: TErrorResponse };
      toast({
        className: "toast-error",
        title: err?.data?.errorMessages![0]?.message,
      });
    }
  };
  return (
    <div>
      <Button
        onClick={handleOpen}
        className="bg-inherit text-inherit hover:bg-inherit relative"
        title={reqData?.officialNotes}
      >
        Notes
        {reqData?.officialNotes ? (
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
            placeholder="Type note here."
            id="orderNote"
            className="min-h-20 border border-primary focus-visible:ring-primary"
            onChange={handleNoteChange}
            defaultValue={reqData?.officialNotes}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleClaimReqUpdate();
              }
            }}
          />
        </div>
        <div className="flex justify-center">
          <EcButton className="w-1/2" onClick={handleClaimReqUpdate}>
            Update
          </EcButton>
        </div>
      </CommonModal>
    </div>
  );
};

export default OfficialNotes;

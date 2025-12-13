import EcButton from "@/components/EcButton/EcButton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useUpdateWarrantyClamReqMutation } from "@/redux/features/warrantyClaimRequests/warrantyClaimApi";
import { TWarrantyClaimContactStatus } from "@/redux/features/warrantyClaimRequests/warrantyClaimInterface";
import { Dispatch, SetStateAction, useState } from "react";
const UpdateWarrantyClaimContactStatus = ({
  contactStatus,
  _id,
  setOpen,
}: {
  contactStatus: TWarrantyClaimContactStatus;
  _id: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [updateStatus, { isLoading }] = useUpdateWarrantyClamReqMutation();
  const [value, setValue] = useState(contactStatus);
  const contactsStatus: TWarrantyClaimContactStatus[] = [
    "pending",
    "retry required",
    "confirmed",
  ];

  const handleContactChange = async () => {
    const updateData = {
      id: _id,
      contactStatus: value,
    };
    try {
      const result = await updateStatus(updateData).unwrap();

      if (result.success) {
        setOpen(false);
        toast({
          className: "bg-success text-white text-2xl",
          title: result.message,
        });
      }
    } catch (error) {
      const err = error as { message: string };
      toast({
        className: "bg-red-500 text-white text-2xl",
        title: err.message,
      });
    }
  };
  return (
    <div className="flex justify-between">
      <Select
        defaultValue={value}
        onValueChange={(changedValue: TWarrantyClaimContactStatus) =>
          setValue(changedValue)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={contactStatus} className="capitalize" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Contact status</SelectLabel>
            {contactsStatus.map((item) => (
              <SelectItem key={item} value={item} className="capitalize">
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <EcButton loading={isLoading} onClick={handleContactChange}>
        Update
      </EcButton>
    </div>
  );
};

export default UpdateWarrantyClaimContactStatus;

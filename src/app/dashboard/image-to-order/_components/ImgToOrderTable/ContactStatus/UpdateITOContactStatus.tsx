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
import { useUpdateImageToOrderReqMutation } from "@/redux/features/imageToOrder/imageToOrderApi";
import { TImageToOrderContactStatus } from "@/redux/features/imageToOrder/imageToOrderInterface";
import { Dispatch, SetStateAction, useState } from "react";

const UpdateITOContactStatus = ({
  contactStatus,
  _id,
  setOpen,
}: {
  contactStatus: TImageToOrderContactStatus;
  _id: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [updateStatus, { isLoading }] = useUpdateImageToOrderReqMutation();
  const [value, setValue] = useState(contactStatus);
  const contactsStatus: TImageToOrderContactStatus[] = [
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
          title: "Image to order request updated successfully",
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
        onValueChange={(changedValue: TImageToOrderContactStatus) =>
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

export default UpdateITOContactStatus;

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
import { TImageToOrderStatus } from "@/redux/features/imageToOrder/imageToOrderInterface";

import { Dispatch, SetStateAction, useState } from "react";

const UpdateITOStatus = ({
  ITOStatus,
  _id,
  setOpen,
}: {
  ITOStatus: TImageToOrderStatus;
  _id: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [updateStatus, { isLoading }] = useUpdateImageToOrderReqMutation();
  const [value, setValue] = useState(ITOStatus);
  const contactsStatus: TImageToOrderStatus[] = [
    "pending",
    "confirmed",
    "canceled",
  ];

  const handleContactChange = async () => {
    const updateData = {
      id: _id,
      status: value,
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
      const err = error as { data: { message: string } };

      toast({
        className: "bg-red-500 text-white text-2xl",
        title: err.data.message,
      });
    }
  };

  return (
    <div className="flex justify-between">
      <Select
        defaultValue={value}
        onValueChange={(changedValue: TImageToOrderStatus) =>
          setValue(changedValue)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={ITOStatus} className="capitalize" />
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

export default UpdateITOStatus;

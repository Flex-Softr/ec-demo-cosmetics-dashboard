"use client";
import EcButton from "@/components/EcButton/EcButton";
import CommonModal from "@/components/modal/CommonModal";
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
import { useUpdateCustomerMutation } from "@/redux/features/registeredCustomer/RegisteredCustomerApi";

import { TRegisteredUserStatus } from "@/types/registeredUser/registeredUser";
import { TErrorResponse, TSuccessResponse } from "@/types/response/response";
import backgroundColor from "@/utilities/backgroundColor";
import { useState } from "react";

const UpdateUserStatus = ({
  status,
  id,
}: {
  status?: TRegisteredUserStatus;
  id: string;
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  // Update
  const [updateUser, { isLoading }] = useUpdateCustomerMutation();
  const [value, setValue] = useState(status);
  const results: TRegisteredUserStatus[] = ["active", "banned", "deleted"];

  const handleResultChange = async () => {
    const updateData = {
      body: { status: value },
      id: id,
    };
    try {
      const result = (await updateUser(
        updateData
      ).unwrap()) as TSuccessResponse;

      if (result.success) {
        setOpen(false);
        toast({
          className: "toast-success ",
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
      <button
        onClick={handleOpen}
        className={`capitalize px-2 pb-[2px] pt-[1px] rounded text-white ${backgroundColor(status as string)}`}
      >
        {status}
      </button>
      <CommonModal
        open={open}
        handleOpen={handleOpen}
        className="h-[450px] "
        modalTitle="Approve and create new order"
      >
        <div>
          <span>Current status : </span>
          <span
            className={`capitalize px-2 pb-[2px] pt-[1px] rounded text-white ${backgroundColor(status as string)}`}
          >
            {status}
          </span>
        </div>
        <div className="space-y-5">
          <Select
            defaultValue={value}
            onValueChange={(changedValue: TRegisteredUserStatus) =>
              setValue(changedValue)
            }
          >
            <SelectTrigger className="w-[180px] capitalize">
              <SelectValue placeholder={value} className="capitalize" />
            </SelectTrigger>
            <SelectContent className="capitalize">
              <SelectGroup>
                <SelectLabel>Result</SelectLabel>
                {results.map((item) => (
                  <SelectItem key={item} value={item} className="capitalize">
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <EcButton loading={isLoading} onClick={handleResultChange}>
            Update
          </EcButton>
        </div>
      </CommonModal>
    </div>
  );
};

export default UpdateUserStatus;

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
import { TWarrantyClaimResult } from "@/redux/features/warrantyClaimRequests/warrantyClaimInterface";
import { TErrorResponse, TSuccessResponse } from "@/types/response/response";
import { Dispatch, SetStateAction, useState } from "react";

const UpdateResult = ({
  warrantyClaimResult,
  _id,
  setOpen,
}: {
  warrantyClaimResult: TWarrantyClaimResult;
  _id: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [updateClaimRequest, { isLoading }] =
    useUpdateWarrantyClamReqMutation();
  const [value, setValue] = useState(warrantyClaimResult);
  const results: TWarrantyClaimResult[] = ["pending", "problem", "solved"];

  const handleResultChange = async () => {
    const updateData = {
      result: value,
      id: _id,
    };
    try {
      const result = (await updateClaimRequest(
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
    <div className="flex justify-between">
      <Select
        defaultValue={value}
        onValueChange={(changedValue: TWarrantyClaimResult) =>
          setValue(changedValue)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue
            placeholder={warrantyClaimResult}
            className="capitalize"
          />
        </SelectTrigger>
        <SelectContent>
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
  );
};

export default UpdateResult;

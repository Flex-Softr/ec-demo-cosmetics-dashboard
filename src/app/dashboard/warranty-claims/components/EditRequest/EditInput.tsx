import EcButton from "@/components/EcButton/EcButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useUpdateWarrantyClamReqMutation } from "@/redux/features/warrantyClaimRequests/warrantyClaimApi";
import { TWarrantyClaim } from "@/redux/features/warrantyClaimRequests/warrantyClaimInterface";
import {
  TErrorMessages,
  TErrorResponse,
  TSuccessResponse,
} from "@/types/response/response";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dispatch, SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

// Yup schema
const schema = yup.object().shape({
  shipping: yup.object().shape({
    fullName: yup.string().optional(),
    phoneNumber: yup.string().optional(),
    fullAddress: yup.string().optional(),
  }),
  warrantyClaimCodes: yup.string().optional(),
});

type TEditReqFormInput = yup.InferType<typeof schema>;

const EditInput = ({
  reqData,
  setOpen,
}: {
  reqData: TWarrantyClaim;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [serverError, setServerError] = useState<TErrorMessages[]>([]);
  const [updateClaimRequest, { isLoading }] =
    useUpdateWarrantyClamReqMutation();
  const { shipping } = reqData;
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });
  const previousClaimedCodes = reqData.warrantyClaimReqData.flatMap(
    ({ claimedCodes }) => claimedCodes
  );

  let warrantyClaimReqData = undefined;
  const onSubmit: SubmitHandler<TEditReqFormInput> = async (data) => {
    setServerError([]);
    if (data.shipping.fullName === reqData.shipping.fullName)
      data.shipping.fullName = undefined;
    if (data.shipping.fullAddress === reqData.shipping.fullAddress)
      data.shipping.fullAddress = undefined;
    if (data.shipping.phoneNumber === reqData.shipping.phoneNumber)
      data.shipping.phoneNumber = undefined;
    const newCodes = data.warrantyClaimCodes
      ?.split(",")
      .map((item) => item.trim());
    if (
      !newCodes?.filter((item) => !previousClaimedCodes.includes(item)).length
    ) {
      warrantyClaimReqData = undefined;
    } else {
      warrantyClaimReqData = newCodes;
    }
    try {
      const res = (await updateClaimRequest({
        ...data,
        id: reqData._id,
        warrantyClaimReqData,
      }).unwrap()) as TSuccessResponse;
      setOpen(false);
      toast({
        className: "toast-success",
        title: res?.message,
      });
    } catch (error) {
      const err = (error as { data: TErrorResponse }).data;
      setServerError(err.errorMessages);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullName">Customer Name</Label>
            <div className="space-y-2 w-full">
              <Input
                type="text"
                defaultValue={shipping?.fullName}
                {...register("shipping.fullName")}
                id="fullName"
                placeholder="Enter Customer Name"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phoneNumber">Mobile No</Label>
            <div className="space-y-2 w-full">
              <Input
                type="text"
                defaultValue={shipping?.phoneNumber}
                {...register("shipping.phoneNumber")}
                id="phoneNumber"
                placeholder="Enter customer mobile number"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullAddress">Full address</Label>
            <div className="space-y-2 w-full">
              <Input
                type="text"
                defaultValue={shipping?.fullAddress}
                {...register("shipping.fullAddress")}
                id="fullAddress"
                placeholder="Enter customer full address"
                className="w-full"
              />
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="fullAddress">Warranty codes</Label>
            <div className="space-y-2 w-full">
              <Input
                type="text"
                defaultValue={previousClaimedCodes.map((item) => " " + item)}
                {...register("warrantyClaimCodes")}
                id="warrantyClaimCodes"
                placeholder="Enter claimed codes, separated by commas (e.g., 495, 455, 354)"
                className="w-full"
              />
            </div>
          </div>
        </div>
        {serverError.length ? (
          <div>
            <ul className="list-disc ml-5">
              {serverError.map((item) => (
                <li
                  key={item.message}
                  className="text-red-600 font-semibold text-sm"
                >
                  {item.message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-6">
          <EcButton type="submit" disabled={isLoading}>
            Update
          </EcButton>
        </div>
      </form>
    </div>
  );
};

export default EditInput;

import EcButton from "@/components/EcButton/EcButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCreateWarrantyClamOrderMutation } from "@/redux/features/warrantyClaimRequests/warrantyClaimApi";
import { TErrorResponse } from "@/types/response/response";
import fetchData, { refetchData } from "@/utilities/fetchData";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  shippingCharge: yup.string().required("Shipping cost is required!"),
  payment: yup.object().shape({
    paymentMethod: yup.string().required("Payment is required!"),
  }),
  advance: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0, "Advance must be a positive number")
    .optional(),
  discount: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? 0 : value))
    .min(0, "Discount must be a positive number")
    .optional(),
  orderNotes: yup.string().optional(),
  officialNotes: yup.string().optional(),
  invoiceNotes: yup.string().optional(),
  courierNotes: yup.string().optional(),
  eventId: yup.string().default("eventId"),
});

type TFormInput = yup.InferType<typeof schema>;

const UpdateApprovalStatus = ({
  _id,
  setOpen,
}: {
  _id: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [createWarrantyClaimOrder] = useCreateWarrantyClamOrderMutation();
  const [shippingCharges, setShippingCharges] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const { toast } = useToast();
  useEffect(() => {
    const shippingCharge = async () => {
      const { data } = await fetchData({
        endPoint: "/shipping-charges",
        tags: ["shippingCharge"],
      });
      setShippingCharges(data);
    };
    const paymentMethod = async () => {
      const { data } = await fetchData({
        endPoint: "/payment-method",
        tags: ["paymentMethod"],
      });
      setPaymentMethods(data);
    };

    shippingCharge();
    paymentMethod();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<TFormInput> = async (data) => {
    try {
      await createWarrantyClaimOrder({ ...data, id: _id }).unwrap();
      await refetchData("allOrders");
      reset();
      setOpen(false);
      toast({
        className: "toast-success",
        title: "Order created successfully!",
      });
    } catch (error) {
      const err = error as { data: TErrorResponse };
      toast({
        className: "toast-error",
        title: err?.data?.message,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-5"></div>
        <div className="grid grid-cols-5 gap-5">
          <div className="flex flex-col gap-2 mb-3">
            <Label htmlFor="cost">
              Shipping Cost <span className="text-red-600">*</span>
            </Label>
            <div className="space-y-2 w-full">
              <select
                {...register("shippingCharge")}
                className="w-full h-9 border border-primary outline-primary rounded-md"
              >
                <option value="">Shipping charge</option>
                {shippingCharges.map(({ _id, name, amount }) => (
                  <option
                    key={_id}
                    value={_id}
                    className="flex items-center gap-5"
                  >
                    {name + " " + amount}
                  </option>
                ))}
              </select>
              {errors.shippingCharge?.message && (
                <p className="text-red-600">
                  {errors.shippingCharge?.message as string}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <Label htmlFor="cost">
              Payment <span className="text-red-600">*</span>
            </Label>
            <div className="space-y-2 w-full">
              <select
                {...register("payment.paymentMethod")}
                className="w-full h-9 border border-gray-300  rounded-sm"
              >
                <option value="">Payment</option>
                {paymentMethods.map(({ _id, name }) => (
                  <option
                    key={_id}
                    value={_id}
                    className="flex items-center gap-5"
                  >
                    {name}
                  </option>
                ))}
              </select>
              {errors.payment?.paymentMethod?.message && (
                <p className="text-red-600">
                  {errors.payment?.paymentMethod?.message as string}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <Label htmlFor="cost">Discount</Label>
            <div className="space-y-2 w-full">
              <Input
                type="number"
                {...register("discount")}
                id="cost"
                placeholder="Enter discount"
                className="w-full"
              />
              {errors.discount?.message && (
                <p className="text-red-600">
                  {errors.discount?.message as string}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <Label htmlFor="cost">Advance</Label>
            <div className="space-y-2 w-full">
              <Input
                type="number"
                {...register("advance")}
                id="cost"
                placeholder="Enter advance"
                className="w-full"
              />
              {errors.advance?.message && (
                <p className="text-red-600">
                  {errors.advance?.message as string}
                </p>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="orderNote">
          <TabsList className="grid w-full grid-cols-3 gap-4 bg-cyan-50">
            <TabsTrigger
              value="orderNote"
              className="border border-cyan-400 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Official Note
            </TabsTrigger>
            <TabsTrigger
              value="invoiceNote"
              className="border border-cyan-400 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Invoice Note
            </TabsTrigger>
            <TabsTrigger
              value="courierNote"
              className="border border-cyan-400 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Courier Note
            </TabsTrigger>
          </TabsList>
          <TabsContent value="orderNote">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="orderNote">Note</Label>
              <Textarea
                placeholder="Type note here."
                id="orderNote"
                className="min-h-20 border border-primary focus-visible:ring-primary"
                {...register("officialNotes")}
              />
            </div>
          </TabsContent>
          <TabsContent value="invoiceNote">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="invoiceNote">Note</Label>
              <Textarea
                placeholder="Type note here."
                id="invoiceNote"
                className="min-h-20 border border-primary focus-visible:ring-primary"
                {...register("invoiceNotes")}
              />
            </div>
          </TabsContent>
          <TabsContent value="courierNote">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="courierNote">Note</Label>
              <Textarea
                placeholder="Type note here."
                id="courierNote"
                className="min-h-20 border border-primary focus-visible:ring-primary"
                {...register("courierNotes")}
              />
            </div>
          </TabsContent>
          <div className="flex items-center justify-center mt-6">
            {/* <Button type="submit" className="w-full" disabled={isLoading}>
                Create order
              </Button> */}
            <EcButton type="submit">Approve & create order</EcButton>
          </div>
        </Tabs>
      </form>
    </div>
  );
};

export default UpdateApprovalStatus;

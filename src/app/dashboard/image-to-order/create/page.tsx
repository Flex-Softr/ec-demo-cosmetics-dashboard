"use client";
import OrderFormSkeleton from "@/components/skeleton/OrderFormSkeleton";
import { useGetSingleImageToOrderReqQuery } from "@/redux/features/imageToOrder/imageToOrderApi";
import { useSearchParams } from "next/navigation";
import OrderForm from "../../orders/components/OrderForm";

export default function CreateImageToOrderPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: reqData, isLoading } = useGetSingleImageToOrderReqQuery(
    { id },
    { skip: !id }
  );

  if (isLoading) return <OrderFormSkeleton />;
  if (!reqData?.data)
    return (
      <div className="p-8 text-center text-lg text-destructive">
        Request not found or invalid ID
      </div>
    );

  const data = reqData.data;

  const initialValues = {
    shipping: {
      fullName: data.shipping?.fullName || "",
      phoneNumber: data.shipping?.phoneNumber || "",
      fullAddress: data.shipping?.fullAddress || "",
    },
    orderNotes: data.customerNotes || "",
  };

  return (
    <div className="p-4">
      <OrderForm initialValues={initialValues} imageToOrderId={data._id} />
    </div>
  );
}

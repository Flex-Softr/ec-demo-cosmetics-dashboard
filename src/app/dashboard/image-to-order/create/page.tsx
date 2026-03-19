"use client";
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

  if (isLoading)
    return <div className="p-8 text-center text-2xl">Loading...</div>;
  if (!reqData?.data)
    return (
      <div className="p-8 text-center text-2xl text-red-600">
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

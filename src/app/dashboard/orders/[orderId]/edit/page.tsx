"use client";
import OrderForm from "@/app/dashboard/orders/components/OrderForm";
import { useGetSingleOrderQuery } from "@/redux/features/orders/ordersApi";
import { Loader2 } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
const EditOrderPage = ({ params }: { params: { orderId: string } }) => {
  const { data: response, isLoading } = useGetSingleOrderQuery(params.orderId);
  const order = response?.data;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-red-500">
        Order not found
      </div>
    );
  }

  const initialValues = {
    shipping: {
      fullName: order?.shipping?.fullName,
      phoneNumber: order?.shipping?.phoneNumber,
      fullAddress: order?.shipping?.fullAddress,
      division: order?.shipping?.division,
      district: order?.shipping?.district,
      upazila: order?.shipping?.upazila,
    },
    shippingCharge:
      order?.shippingCharge?._id ||
      (order?.shippingCharge as unknown as string),
    payment: {
      paymentMethod:
        (order?.payment?.paymentMethod as any)?._id ||
        order?.payment?.paymentMethod,
      paymentDetails: order?.payment?.paymentDetails,
    },
    advance: order?.advance || 0,
    discount: order?.discount || 0,
    orderedProducts: order?.products?.map((prod: any) => ({
      _id: prod._id,
      product: prod.productId,
      quantity: prod.quantity,
      variation: prod.variation?._id || "",
      attributes: prod.attributes,
    })),
    orderSource: {
      name: order?.orderSource?.name,
    },
    orderNotes: order?.orderNotes || "",
    officialNotes: order?.officialNotes || "",
    invoiceNotes: order?.invoiceNotes || "",
    courierNotes: order?.courierNotes || "",
    eventId: order?.eventId,
  };

  return (
    <div className="p-2">
      <OrderForm
        initialValues={initialValues}
        title={`Edit Order #${order?.orderId}`}
        isEdit={true}
        orderId={order?._id}
      />
    </div>
  );
};

export default EditOrderPage;

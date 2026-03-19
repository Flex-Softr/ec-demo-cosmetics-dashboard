"use client";
import OrderForm from "@/app/dashboard/orders/components/OrderForm";
import Loading from "@/app/loading";
import { useGetSingleOrderQuery } from "@/redux/features/orders/ordersApi";

/* eslint-disable @typescript-eslint/no-explicit-any */
const EditOrderContent = ({ orderId }: { orderId: string }) => {
  const { data, isLoading } = useGetSingleOrderQuery(orderId);
  const order = data?.data;

  if (isLoading) {
    return <Loading />;
  }

  if (!order) {
    return <h2 className="text-center font-bold py-2">No order found</h2>;
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
    couponDiscount: order?.couponDiscount || 0,
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
    <OrderForm
      initialValues={initialValues}
      isEdit={true}
      orderId={order?._id}
      order={order}
    />
  );
};

export default EditOrderContent;

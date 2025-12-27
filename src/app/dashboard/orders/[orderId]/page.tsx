import { getPermission } from "@/lib/getAccessToken";
import OrderDetailsView from "./components/OrderDetailsView";

const OrderDetails = async ({ params }: { params: { orderId: string } }) => {
  const { permissions = [] } = await getPermission();

  return (
    <OrderDetailsView orderId={params.orderId} permissions={permissions} />
  );
};

export default OrderDetails;

import { Card } from "@/components/ui/card";
import { getPermission } from "@/lib/getAccessToken";
import { TCustomer } from "@/redux/features/customer/customerInterface";
import backgroundColor from "@/utilities/backgroundColor";
import fetchData from "@/utilities/fetchData";
import OrderHistoryTable from "../../orders/[orderId]/components/SetOrderHistoryData";
import AllOrdersTable from "../../orders/components/AllOrdersTable";

const page = async ({ params }: { params: { id: string } }) => {
  const { permissions = [] } = await getPermission();
  let customer: TCustomer | undefined;
  try {
    const { data } = await fetchData({
      endPoint: `/customers/${params.id}`,
    });
    customer = data as TCustomer;
  } catch (error) {
    if (!customer)
      return <h2 className="text-center font-bold py-2">No customer found</h2>;
  }

  return (
    <Card className="m-4">
      <h2 className="text-2xl">Name : {customer?.name}</h2>
      <ul>
        <li>UID : {customer?.uid}</li>
        <li>Phone : {customer?.phoneNumber}</li>
        <li>Email : {customer?.email || "N/A"}</li>
        <li>
          Status :{" "}
          <span
            className={`${backgroundColor(customer.status)} capitalize p-1 rounded-sm`}
          >
            {customer?.status}{" "}
          </span>
        </li>
      </ul>
      <hr className="my-4" />
      <div className="mt-4">
        <h4 className="py-3 font-semibold">Orders</h4>
        <OrderHistoryTable userId={customer._id} />
        <AllOrdersTable permissions={permissions} />
      </div>
    </Card>
  );
};

export default page;

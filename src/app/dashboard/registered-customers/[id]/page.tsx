import { getPermission } from "@/lib/getAccessToken";
import CustomerDetailsView from "../_components/CustomerDetailsView";

const page = async ({ params }: { params: { id: string } }) => {
  const { permissions = [] } = await getPermission();

  return <CustomerDetailsView id={params.id} permissions={permissions} />;
};

export default page;

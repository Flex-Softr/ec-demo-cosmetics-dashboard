import { getPermission } from "@/lib/getAccessToken";
import { permission } from "@/types/order/order.interface";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import PaymentConfigContainer from "./components/PaymentConfigContainer";

export const metadata = {
  title: "Payment Configuration",
  description: "Payment Configuration",
};

export default async function PaymentConfigurationPage() {
  const { permissions = [] } = await getPermission();

  const isShow = isPermitted(permissions, permission.managePaymentMethod);

  if (!isShow) {
    redirect("/error?s=d");
  }

  return <PaymentConfigContainer />;
}

import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import PaymentConfigContainer from "./components/PaymentConfigContainer";

export const metadata = {
  title: "Payment Configuration",
  description: "Payment Configuration",
};

export default async function PaymentConfigurationPage() {
  const { permissions = [] } = await getPermission();

  const isShow = isPermitted(permissions, PERMISSIONS.MANAGE_PAYMENT_METHOD);

  if (!isShow) {
    redirect("/error?s=d");
  }

  return <PaymentConfigContainer />;
}

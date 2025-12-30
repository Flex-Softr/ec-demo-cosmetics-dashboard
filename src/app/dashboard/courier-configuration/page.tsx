import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";
import CourierConfigContainer from "./components/CourierConfigContainer";

export const metadata = {
  title: "Courier Configuration",
  description: "Courier Configuration",
};

const CourierConfigurationPage = async () => {
  const { permissions = [] } = await getPermission();

  const manageProduct = isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT);

  if (!manageProduct) {
    redirect("/error");
  }

  return <CourierConfigContainer />;
};

export default CourierConfigurationPage;

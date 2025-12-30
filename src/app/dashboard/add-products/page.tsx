import { PERMISSIONS } from "@/const/permissions";
import { getPermission } from "@/lib/getAccessToken";
import isPermitted from "@/utilities/isPermitted";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ProductForm from "./components/ProductForm";

export const metadata: Metadata = {
  title: "Add Product",
  description: "Add Product",
};

const AddProducts = async () => {
  const { permissions = [] } = await getPermission();

  const addProduct = isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT);

  if (!addProduct) {
    redirect("/error");
  }
  return <ProductForm />;
};

export default AddProducts;

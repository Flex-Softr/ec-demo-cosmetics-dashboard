import { Metadata } from "next";
import ProductForm from "./components/ProductForm";

export const metadata: Metadata = {
  title: "Add Product",
  description: "Add Product",
};

const AddProducts = async () => {
  return <ProductForm />;
};

export default AddProducts;

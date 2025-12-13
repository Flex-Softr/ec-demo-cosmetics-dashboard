import AddProducts from "@/app/dashboard/add-products/page";
import React from "react";
import SetProduct from "./components/SetProduct";

const UpdateProduct = ({ params }: { params: { productId: string } }) => {
  return (
    <>
      <SetProduct productId={params.productId} />
      <AddProducts productId={params.productId} />
    </>
  );
};

export default UpdateProduct;

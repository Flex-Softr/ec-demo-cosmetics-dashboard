import ProductForm from "../../add-products/components/ProductForm";
import EditProductWrapper from "./components/EditProductWrapper";
import SetProduct from "./components/SetProduct";

const UpdateProduct = ({ params }: { params: { productId: string } }) => {
  return (
    <EditProductWrapper productId={params.productId}>
      <SetProduct productId={params.productId} />
      <ProductForm productId={params.productId} />
    </EditProductWrapper>
  );
};

export default UpdateProduct;

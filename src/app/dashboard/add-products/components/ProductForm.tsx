import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import AdditionalInfo from "./AdditionalInfo";
import Brand from "./Brand";
import Category from "./Category";
import Description from "./Description";
import ProductResetter from "./ProductResetter";
import Published from "./Published";
import ShortDescription from "./ShortDescription";
import Title from "./Title";
import ProductData from "./productData/ProductsData";

const ProductForm = ({ productId }: { productId?: string }) => {
  return (
    <div className="mb-10">
      {!productId && <ProductResetter />}
      <Card className="flex gap-3 justify-between items-center m-4">
        <h1 className="text-2xl font-bold">
          {productId ? "Edit Product" : "Add Product"}
        </h1>
        <Link href={"/dashboard/products"} passHref>
          <Button>View All</Button>
        </Link>
      </Card>

      {/* product data section started */}
      <div className="flex justify-between items-start gap-4 w-full px-4">
        <div className="w-[65%] space-y-3">
          {/* products title */}
          <Title />
          <ShortDescription />
          {/* products description */}
          <Description />

          {/* product data */}
          <ProductData productId={productId as string} />
          <AdditionalInfo />
          {/* <SeoData /> */}
        </div>
        {/* right Sidebar of add products */}
        <div className="w-2/6 space-y-3">
          <Published productId={productId as string} />
          <Category />
          {/* <Tag tags={tags} /> */}
          <Brand />
        </div>
      </div>
    </div>
  );
};

export default ProductForm;

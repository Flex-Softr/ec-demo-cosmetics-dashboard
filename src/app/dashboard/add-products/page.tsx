import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Category from "./components/Category";
import Description from "./components/Description";
import Published from "./components/Published";
// import Tag from "./components/Tag";
import Title from "./components/Title";
import ProductData from "./components/productData/ProductsData";
// import getTags from "./lib/getTags";
import Link from "next/link";
import AdditionalInfo from "./components/AdditionalInfo";
import Brand from "./components/Brand";
import ShortDescription from "./components/ShortDescription";

const AddProducts = async ({ productId }: { productId: string }) => {
  return (
    <div className="mb-10">
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
          <ProductData productId={productId} />
          <AdditionalInfo />
          {/* <SeoData /> */}
        </div>
        {/* right Sidebar of add products */}
        <div className="w-2/6 space-y-3">
          <Published productId={productId} />
          <Category />
          {/* <Tag tags={tags} /> */}
          <Brand />
        </div>
      </div>
    </div>
  );
};

export default AddProducts;

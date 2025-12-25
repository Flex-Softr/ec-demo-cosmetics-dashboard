import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Category from "./components/Category";
import Description from "./components/Description";
import Published from "./components/Published";
// import SeoData from "./components/SeoData";
// import Tag from "./components/Tag";
import Title from "./components/Title";
import ProductData from "./components/productData/ProductsData";
import getAttributes from "./lib/getAttributes";
// import getTags from "./lib/getTags";
import fetchData from "@/utilities/fetchData";
import Link from "next/link";
import Brand from "./components/Brand";
import ShortDescription from "./components/ShortDescription";
import AdditionalInfo from "./components/AdditionalInfo";
// import getBrands from "./lib/getBrands";

const AddProducts = async ({ productId }: { productId: string }) => {
  const [attributes, categoriesResponse, brandsResponse] = await Promise.all([
    getAttributes(),
    fetchData({ endPoint: "/categories", tags: ["categories"] }),
    fetchData({ endPoint: "/brands", tags: ["brands"] }),
  ]);

  const { data: categories } = categoriesResponse;
  const { data: brands } = brandsResponse;
  // const brands = await getBrands();

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
          <ProductData attributes={attributes} productId={productId} />
          <AdditionalInfo />
          {/* <SeoData /> */}
        </div>
        {/* right Sidebar of add products */}
        <div className="w-2/6 space-y-3">
          <Published productId={productId} />
          <Category categories={categories} />
          {/* <Tag tags={tags} /> */}
          <Brand brands={brands} />
        </div>
      </div>
    </div>
  );
};

export default AddProducts;

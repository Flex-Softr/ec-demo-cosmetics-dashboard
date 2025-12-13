import Show from "@/components/Show";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import fetchData from "@/utilities/fetchData";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import CountByStatusButtons from "./components/CountByStatusButtons";
import Filter from "./components/Filter";
import ProductBulkAction from "./components/ProductBulkAction";
import ProductSearchBar from "./components/ProductSearchBar";
import ProductsTable from "./components/ProductsTable";

const AllProducts = async () => {
  const { data: categories } = await fetchData({
    endPoint: "/categories",
    tags: ["categories"],
  });

  return (
    <Card className="bg-white px-4 pt-4 rounded-md m-4">
      {/* header section, search bar  */}
      <div className="grid grid-cols-2 justify-between items-center">
        <h1 className="text-2xl font-bold">All Products</h1>
        <ProductSearchBar endPoint="/products/admin" />
      </div>
      <hr className="my-4" />
      <div className="space-y-3">
        {/* All, published, public, private, draft, Trash status */}
        <CountByStatusButtons />
        <div className="flex items-center justify-between gap-5 overflow-x-auto pt-4 px-1 pb-1">
          {/*Bulk actions and invoice print for Orders*/}
          {/* <div className="flex items-center gap-5"> */}
          <ProductBulkAction />
          <Link href={"/dashboard/add-products"} passHref>
            <Button className="rounded-2xl">
              <PlusIcon /> <span>Add New Product</span>
            </Button>
          </Link>
          {/* Filter options by category and stock status*/}
          <Filter categories={categories} />
          {/* </div> */}
          <Show />
        </div>
        {/* All products Table  */}
        <ProductsTable></ProductsTable>
      </div>
    </Card>
  );
};

export default AllProducts;

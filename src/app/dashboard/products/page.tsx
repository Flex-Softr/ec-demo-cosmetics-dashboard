import Show from "@/components/Show";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import CountByStatusButtons from "./components/CountByStatusButtons";
import ProductFilter from "./components/ProductFilter";
import ProductBulkAction from "./components/ProductBulkAction";
import ProductSearchBar from "./components/ProductSearchBar";
import ProductsTable from "./components/ProductsTable";
import { getPermission } from "@/lib/getAccessToken";
import { PERMISSIONS } from "@/const/permissions";
import isPermitted from "@/utilities/isPermitted";
import { redirect } from "next/navigation";

const AllProducts = async () => {
  const { permissions = [] } = await getPermission();

  const manageProduct = isPermitted(permissions, PERMISSIONS.MANAGE_PRODUCT);

  if (!manageProduct) {
    redirect("/error");
  }

  return (
    <Card className="m-2 sm:m-4 p-4 sm:p-6">
      {/* header section, search bar  */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold">All Products</h1>
        <div className="w-full sm:w-auto">
          <ProductSearchBar endPoint="/products/admin" />
        </div>
      </div>
      <hr className="my-4" />
      <div className="space-y-3">
        {/* product status list*/}
        <div className="flex flex-wrap md:justify-between items-center gap-5">
          <CountByStatusButtons />{" "}
          <Link href={"/dashboard/add-products"} passHref>
            <Button className="rounded-2xl">
              <PlusIcon /> <span>Add New Product</span>
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-5 overflow-x-auto pt-4 px-1 pb-1">
          {/*Bulk actions and invoice print for Orders*/}
          {/* <div className="flex items-center gap-5"> */}
          <ProductBulkAction />

          {/* Filter options by category and stock status*/}
          <ProductFilter />
          {/* </div> */}
          <Show />
        </div>
        {/* All products Table  */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <ProductsTable />
        </div>
      </div>
    </Card>
  );
};

export default AllProducts;

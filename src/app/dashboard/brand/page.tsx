import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import AddBrandForm from "./components/AddBrandForm";
import { BrandTable } from "./components/BrandsTable";

const Brand = () => {
  return (
    <div className="flex gap-4 justify-between items-start h-screen px-4 pt-4">
      <Card className="space-y-5 flex-1">
        <h2 className="text-xl font-bold"> Add New Brand</h2>
        <AddBrandForm />
      </Card>
      <Card className="space-y-5 flex-1 h-full">
        <h2 className="text-xl font-bold"> All Brands</h2>
        <div>
          <BrandTable />
          <Pagination />
        </div>
      </Card>
    </div>
  );
};

export default Brand;

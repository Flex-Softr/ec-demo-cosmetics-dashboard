import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import AddBrandForm from "./components/AddBrandForm";
import fetchData from "@/utilities/fetchData";
import { BrandTable } from "./components/BrandsTable";

const Brand = async () => {
  const { data } = await fetchData({ endPoint: "/brands", tags: ["brands"] });

  return (
    <div className="flex gap-4 justify-between items-start h-screen px-3 pt-3">
      <Card className="p-4 shadow-none rounded-xl space-y-5 flex-1">
        <h2 className="text-xl font-bold"> Add New Brand</h2>
        <AddBrandForm />
      </Card>
      <Card className="p-4 shadow-none rounded-xl space-y-5 flex-1">
        <h2 className="text-xl font-bold"> All Brands</h2>
        <div>
          <BrandTable brands={data} />
          <Pagination />
        </div>
      </Card>
    </div>
  );
};

export default Brand;

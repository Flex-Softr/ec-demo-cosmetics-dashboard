import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import AddCategoryForm from "./components/AddCategoryForm";
import { CategoryTable } from "./components/CategoryTable";
import fetchData from "@/utilities/fetchData";

const AddCategory = async () => {
  const { data } = await fetchData({
    endPoint: "/categories",
    tags: ["categories"],
  });

  return (
    <div className="flex gap-4 justify-between items-start h-screen px-4 pt-4">
      <Card className="space-y-5 flex-1">
        <h2 className="text-xl font-bold">Add New category</h2>
        <AddCategoryForm />
      </Card>
      <Card className="space-y-5 flex-1">
        <h2 className="text-xl font-bold">All Categories</h2>
        <div>
          <CategoryTable categories={data} />
          <Pagination />
        </div>
      </Card>
    </div>
  );
};

export default AddCategory;

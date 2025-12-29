import { Card } from "@/components/ui/card";
import AddCategoryForm from "./components/AddCategoryForm";
import { CategoryTable } from "./components/CategoryTable";

const AddCategory = () => {
  return (
    <Card className="m-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Set Up</h1>
        <AddCategoryForm />
      </div>
      <hr className="my-4" />
      <div className="w-full">
        <CategoryTable />
      </div>
    </Card>
  );
};

export default AddCategory;

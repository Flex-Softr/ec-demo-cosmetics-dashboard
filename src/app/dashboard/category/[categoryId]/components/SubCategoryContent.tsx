"use client";
import AddSubCategoryForm from "./AddSubCategoryForm";
import { SubCategoryTable } from "./SubCategoryTable";
import { useGetSingleCategoryQuery } from "@/redux/features/category/categoryApi";

const SubCategoryContent = ({ categoryId }: { categoryId: string }) => {
  const { data, isLoading } = useGetSingleCategoryQuery(categoryId);
  const category = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Sub Category of{" "}
            <span className="text-primary">{category?.name}</span>
          </h1>
          <p className="text-muted-foreground">{category?.description}</p>
        </div>
        <AddSubCategoryForm parent={categoryId} />
      </div>
      <hr className="my-4" />
      <div className="w-full">
        <SubCategoryTable subcategories={category?.subcategories || []} />
      </div>
    </>
  );
};

export default SubCategoryContent;

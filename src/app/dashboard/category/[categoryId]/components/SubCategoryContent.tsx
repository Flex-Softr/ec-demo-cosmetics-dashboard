"use client";
import CategoryForm from "../../components/CategoryForm";
import { Button } from "@/components/ui/button";
import { SubCategoryTable } from "./SubCategoryTable";
import { useGetSingleCategoryQuery } from "@/redux/features/category/categoryApi";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const SubCategoryContent = ({ categoryId }: { categoryId: string }) => {
  const router = useRouter();
  const { data, isLoading } = useGetSingleCategoryQuery(categoryId);
  const category = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full h-8 w-8 hover:bg-primary"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">
              <span className="whitespace-nowrap">Sub Category of </span>
              <span className="text-primary whitespace-nowrap">
                {category?.name}
              </span>
            </h1>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {category?.description}
            </p>
          </div>
        </div>
        <CategoryForm
          parent={categoryId}
          isSubCategory={true}
          trigger={<Button size="sm">Add Sub Category</Button>}
        />
      </div>
      <SubCategoryTable subcategories={category?.subcategories || []} />
    </>
  );
};

export default SubCategoryContent;

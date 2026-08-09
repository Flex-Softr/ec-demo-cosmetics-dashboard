"use client";
import CategoryForm from "../../components/CategoryForm";
import { Button } from "@/components/ui/button";
import { SubCategoryTable } from "./SubCategoryTable";
import { useGetSingleCategoryQuery } from "@/redux/features/category/categoryApi";
import { ArrowLeft, FolderTree, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const SubCategoryContent = ({ categoryId }: { categoryId: string }) => {
  const router = useRouter();
  const { data, isLoading } = useGetSingleCategoryQuery(categoryId);
  const category = data?.data;

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Loading children…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9 rounded-lg border border-border hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FolderTree className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight text-foreground">
                Children of{" "}
                <span className="text-primary">{category?.name}</span>
              </h1>
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {category?.description || "Manage nested categories"}
              </p>
            </div>
          </div>
        </div>
        <CategoryForm
          parent={categoryId}
          isSubCategory={true}
          trigger={
            <Button size="sm" className="rounded-lg gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Child</span>
            </Button>
          }
        />
      </div>
      <SubCategoryTable subcategories={category?.children || []} />
    </div>
  );
};

export default SubCategoryContent;

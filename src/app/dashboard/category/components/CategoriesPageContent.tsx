"use client";

import { useGetCategoriesQuery } from "@/redux/features/category/categoryApi";
import { TCategories } from "../lib/category.interface";
import { FolderPlus, FolderTree, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CategoryForm from "./CategoryForm";
import CategoryTreeView from "./CategoryTreeView";

type Mode = "create" | "edit" | null;

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-5 p-10 text-center min-h-[400px]">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <FolderPlus className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-1.5 max-w-xs">
        <p className="text-sm font-semibold text-foreground">
          No category selected
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Click a category in the tree to edit it, or create a new one.
        </p>
      </div>
      <Button onClick={onNew} size="sm" className="rounded-lg gap-1.5">
        <Plus className="h-4 w-4" />
        New Category
      </Button>
    </div>
  );
}

export default function CategoriesPageContent() {
  const [mode, setMode] = useState<Mode>(null);
  const [editCategory, setEditCategory] = useState<TCategories | null>(null);

  const { data, isLoading } = useGetCategoriesQuery({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseData: any = data?.data;
  const categories =
    (responseData?.data as TCategories[]) ||
    (data?.data?.data as TCategories[]) ||
    [];

  const handleEdit = (cat: TCategories) => {
    setEditCategory(cat);
    setMode("edit");
  };

  const handleClose = () => {
    setMode(null);
    setEditCategory(null);
  };

  const handleNew = () => {
    setEditCategory(null);
    setMode("create");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <FolderTree className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Categories
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage your product categories
            </p>
          </div>
        </div>
        <Button onClick={handleNew} size="sm" className="rounded-lg gap-1.5">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Category</span>
        </Button>
      </div>

      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
        {/* Tree panel */}
        <div className="lg:col-span-2 bg-card border rounded-xl flex flex-col max-h-[calc(100vh-160px)]">
          <div className="px-4 pt-4 pb-3 border-b shrink-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Category Tree
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Click to expand or edit
            </p>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            {isLoading ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                Loading categories...
              </div>
            ) : (
              <CategoryTreeView items={categories} onEdit={handleEdit} />
            )}
          </div>
        </div>

        {/* Form panel */}
        <div className="lg:col-span-3 bg-card border rounded-xl">
          {mode === null ? (
            <EmptyState onNew={handleNew} />
          ) : (
            <>
              <div className="px-5 pt-5 pb-4 border-b">
                <h2 className="text-sm font-semibold text-foreground">
                  {mode === "create"
                    ? "New Category"
                    : `Edit: ${editCategory?.name ?? "…"}`}
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {mode === "create"
                    ? "Fill in the details to create a new category"
                    : "Update the category information below"}
                </p>
              </div>
              <div className="p-5">
                <CategoryForm
                  initialData={mode === "edit" ? editCategory : null}
                  onSuccess={handleClose}
                  onCancel={handleClose}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

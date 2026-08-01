"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useDeleteCategoryMutation } from "@/redux/features/category/categoryApi";
import { revalidateTag } from "@/utilities/revalidate";
import { SquarePen, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { TCategories } from "../lib/category.interface";
import CategoryForm from "./CategoryForm";

type CategoryActionBaseProps = {
  category: TCategories;
  isSubCategory?: boolean;
};

const CategoryActionBase = ({
  category,
  isSubCategory = false,
}: CategoryActionBaseProps) => {
  const { _id } = category;
  const [deleteCategory] = useDeleteCategoryMutation();

  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleOpen = (value?: boolean) => {
    if (typeof value === "boolean") {
      setOpen(value);
    } else {
      setOpen(!open);
    }
  };

  const handleDelete = async (id: string) => {
    const categoryIds = [id];

    try {
      const res = await deleteCategory(categoryIds).unwrap();

      if (res?.success) {
        toast({
          className: "bg-success text-white",
          title: isSubCategory
            ? "Sub category Successfully Deleted"
            : "Category Successfully Deleted",
        });

        setDeleteOpen(false);
        await revalidateTag(["categories"]);
      }
    } catch (error) {
      toast({
        className: "bg-danger text-white",
        title: "Something Went Wrong",
      });
    }
  };

  return (
    <div className="flex items-center justify-center gap-0.5">
      <CategoryForm
        initialData={category}
        open={open}
        setOpen={handleOpen}
        isSubCategory={isSubCategory}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
            onClick={() => handleOpen(true)}
          >
            <SquarePen className="h-4 w-4" />
          </Button>
        }
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <h1 className="text-lg font-semibold text-foreground">
            Delete {isSubCategory ? "Sub Category" : "Category"}?
          </h1>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {category.name}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="rounded-lg">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              className="rounded-lg"
              onClick={() => handleDelete(_id)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryActionBase;

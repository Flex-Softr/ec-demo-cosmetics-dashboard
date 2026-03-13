"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
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

  const handleDeleteOpen = () => {
    setDeleteOpen(!deleteOpen);
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
    <span className="flex items-center gap-3 justify-center">
      <CategoryForm
        initialData={category}
        open={open}
        setOpen={handleOpen}
        isSubCategory={isSubCategory}
        trigger={<SquarePen className="text-green-500 cursor-pointer" />}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Trash2Icon
            className="text-red-500 cursor-pointer"
            onClick={handleDeleteOpen}
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle className="text-3xl">Are you sure?</DialogTitle>
          <div className="flex gap-4 items-center ">
            <DialogClose asChild>
              <Button className="bg-red-500 hover:bg-red-500">Cancel</Button>
            </DialogClose>
            <Button onClick={() => handleDelete(_id)}>Yes, Delete it!</Button>
          </div>
        </DialogContent>
      </Dialog>
    </span>
  );
};

export default CategoryActionBase;

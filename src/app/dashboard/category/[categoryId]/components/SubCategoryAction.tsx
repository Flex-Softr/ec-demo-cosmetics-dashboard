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
import { SquarePen, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { TSubCategories } from "./SubCategoryTable";
import UpdateSubCategoryForm from "./UpdateSubcategoryForm";
import { useDeleteCategoryMutation } from "@/redux/features/category/categoryApi";
import { revalidateTag } from "@/utilities/revalidate";

const SubCategoryAction = ({ category }: { category: TSubCategories }) => {
  const { _id, name, image, parent } = category;
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

    const res = await deleteCategory(categoryIds).unwrap();

    if (res?.success) {
      toast({
        className: "bg-success text-white ",
        title: "Sub category Successfully Deleted",
      });
      setDeleteOpen(false);
      await revalidateTag(["allCategories", "parentCategory"]);
    } else {
      toast({
        className: " bg-danger text-whit",
        title: "Something Went Wrong",
      });
    }
  };

  return (
    <span className="flex items-center gap-3 justify-center">
      <Dialog onOpenChange={handleOpen} open={open}>
        <DialogTrigger>
          <SquarePen className="text-green-500" />
        </DialogTrigger>
        <DialogContent className=" h-fit">
          <DialogTitle className="text-2xl font-semibold">
            Update sub category
          </DialogTitle>
          <div>
            <UpdateSubCategoryForm
              id={_id}
              name={name}
              image={image}
              parent={parent}
              handleOpen={handleOpen}
            />
          </div>
        </DialogContent>
      </Dialog>
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

export default SubCategoryAction;

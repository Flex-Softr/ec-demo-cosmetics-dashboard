"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useDeleteBrandMutation } from "@/redux/features/brand/brandApi";
import { TBrand } from "../lib/brand.interface";
import { SquarePen, Trash2Icon } from "lucide-react";
import { useState } from "react";
import BrandForm from "./BrandForm";
import { revalidateTag } from "@/utilities/revalidate";

const BrandAction = ({ brand }: { brand: TBrand }) => {
  const [deleteBrand] = useDeleteBrandMutation();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await deleteBrand([brand._id]).unwrap();
      if (res?.success) {
        await revalidateTag(["brands"]);
        toast({
          className: "bg-success text-white",
          title: "Brand deleted successfully",
        });
        setDeleteOpen(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.data?.message || "Failed to delete brand",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 justify-center">
      {/* Edit Action */}
      <BrandForm
        open={editOpen}
        setOpen={setEditOpen}
        initialData={brand}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditOpen(true)}
            className="!bg-white hover:!bg-gray-100"
          >
            <SquarePen className="h-4 w-4 text-green-600" />
          </Button>
        }
      />

      {/* Delete Action */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="!bg-white hover:!bg-gray-100"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon className="h-4 w-4 text-red-600" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <h1 className="text-xl font-bold">Delete Brand?</h1>
          <p className="text-gray-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{brand.name}</span>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-5 mt-4">
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandAction;

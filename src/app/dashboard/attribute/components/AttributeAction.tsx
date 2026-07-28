"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useDeleteAttributeMutation } from "@/redux/features/attributes/attributesApi";
import { TAttribute } from "../lib/attribute.interface";
import { SquarePen, Trash2Icon } from "lucide-react";
import { useState } from "react";
import AttributeValueUpdateModal from "./AttributeValueUpdateModal";

const AttributeAction = ({ attribute }: { attribute: TAttribute }) => {
  const [deleteAttribute] = useDeleteAttributeMutation();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await deleteAttribute({
        attributeIds: [attribute._id],
      }).unwrap();
      if (res?.success) {
        toast({
          className: "bg-success text-white",
          title: "Attribute deleted successfully",
        });
        setDeleteOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: res?.message || "Failed to delete attribute",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error?.data?.message || "Failed to delete attribute",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 justify-center">
      {/* Configure Terms Action */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="!bg-white hover:!bg-gray-100 h-8 w-8"
          >
            <SquarePen className="h-4 w-4 text-primary" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] h-fit max-h-[90vh] overflow-y-auto">
          <AttributeValueUpdateModal attribute={attribute} />
        </DialogContent>
      </Dialog>

      {/* Delete Action */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="!bg-white hover:!bg-gray-100 h-8 w-8"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2Icon className="h-4 w-4 text-red-600" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <h1 className="text-xl font-bold">Delete Attribute?</h1>
          <p className="text-gray-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{attribute.name}</span>? This action
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

export default AttributeAction;
